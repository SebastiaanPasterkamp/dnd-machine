-- Create 'adventureleaguelog' table

DROP TABLE IF EXISTS `adventureleaguelog`;
CREATE TABLE `adventureleaguelog` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `user_id` INTEGER NOT NULL,
  `character_id` INTEGER,
  `consumed` BOOLEAN DEFAULT false,
  `config` TEXT
);
