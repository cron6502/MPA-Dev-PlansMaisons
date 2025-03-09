/*
  # Ajout de la gestion des prix

  1. Modifications
    - Ajout d'une colonne `price` à la table `house_plans`
    - Mise à jour des politiques pour la gestion des prix

  2. Sécurité
    - Seuls les professionnels et administrateurs peuvent modifier les prix
*/

-- Ajout de la colonne prix
ALTER TABLE house_plans ADD COLUMN IF NOT EXISTS price numeric NOT NULL DEFAULT 0;

-- Mise à jour des politiques
CREATE POLICY "Les professionnels peuvent modifier les prix"
  ON house_plans
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'professional' OR users.role = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'professional' OR users.role = 'admin')
    )
  );