/*
  # Ajout des prestations complémentaires

  1. Nouvelles Tables
    - `additional_services`
      - `id` (uuid, clé primaire)
      - `name` (text, nom du service)
      - `price` (numeric, prix du service)
      - `description` (text, description du service)
      - `is_default` (boolean, si le service est inclus par défaut)
      - `created_at` (timestamp)

    - `plan_services`
      - `id` (uuid, clé primaire)
      - `plan_id` (uuid, référence vers house_plans)
      - `service_id` (uuid, référence vers additional_services)
      - `price` (numeric, prix spécifique pour ce plan, peut être NULL)
      - `created_at` (timestamp)

  2. Sécurité
    - Enable RLS sur les deux tables
    - Politiques de lecture pour tous les utilisateurs
    - Politiques de modification pour les professionnels et administrateurs

  3. Données Initiales
    - Insertion des services par défaut avec leurs prix standards
*/

-- Création de la table des services additionnels
CREATE TABLE IF NOT EXISTS additional_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL,
  description text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Création de la table de liaison entre plans et services
CREATE TABLE IF NOT EXISTS plan_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES house_plans(id) ON DELETE CASCADE,
  service_id uuid REFERENCES additional_services(id) ON DELETE CASCADE,
  price numeric,
  created_at timestamptz DEFAULT now(),
  UNIQUE(plan_id, service_id)
);

-- Activation de la RLS
ALTER TABLE additional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_services ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour additional_services
CREATE POLICY "Tout le monde peut voir les services"
  ON additional_services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Les professionnels peuvent modifier les services"
  ON additional_services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'professional' OR users.role = 'admin')
    )
  );

-- Politiques de sécurité pour plan_services
CREATE POLICY "Tout le monde peut voir les services des plans"
  ON plan_services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Les professionnels peuvent gérer les services des plans"
  ON plan_services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'professional' OR users.role = 'admin')
    )
  );

-- Insertion des services par défaut
INSERT INTO additional_services (name, price, description, is_default) VALUES
  ('Dossier papier en trois exemplaires', 50, 'Dossier papier en trois exemplaires papier adressé par voie postale (hors frais d''envoi Chronopost)', false),
  ('Dossier PDF format A3', 0, 'Dossier pdf en format A3 adressé par courriel', true),
  ('Fondations standard', 0, 'Fondations standard coulées en place', true),
  ('Fondations sur plots et longrines', 250, 'Fondations sur plots et longrines hors fondations spéciales (prestation BET - note de calcul)', false),
  ('Guide de montage', 50, 'Guide et/ou notice de montage (si disponible)', false);