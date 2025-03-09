/*
  # Mise à jour du prix par défaut

  1. Modifications
    - Modification de la valeur par défaut de la colonne `price` dans la table `house_plans`
    - Mise à jour des prix existants à 1000€ si non définis

  2. Sécurité
    - Aucun changement dans les politiques de sécurité
*/

-- Modification de la valeur par défaut
ALTER TABLE house_plans ALTER COLUMN price SET DEFAULT 1000;

-- Mise à jour des prix existants à 1000€ si non définis ou à 0
UPDATE house_plans SET price = 1000 WHERE price = 0 OR price IS NULL;