/*
  # Ajout des rôles utilisateurs

  1. Modifications
    - Ajout d'une colonne `role` à la table `users`
    - Valeurs possibles : 'visitor', 'professional', 'admin'
    - Mise à jour des politiques de sécurité

  2. Sécurité
    - Mise à jour des politiques RLS pour les différents rôles
*/

-- Ajout de l'énumération pour les rôles
CREATE TYPE user_role AS ENUM ('visitor', 'professional', 'admin');

-- Ajout de la colonne role à la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'visitor';

-- Mise à jour des politiques
CREATE POLICY "Les professionnels peuvent ajouter des plans"
  ON house_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'professional' OR users.role = 'admin')
    )
  );

CREATE POLICY "Les professionnels peuvent modifier leurs plans"
  ON house_plans
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'professional' OR users.role = 'admin')
    )
  );

CREATE POLICY "Les administrateurs peuvent tout faire"
  ON house_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );