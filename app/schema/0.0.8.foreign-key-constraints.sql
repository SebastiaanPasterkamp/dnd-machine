-- Add foreign key constraints to link tables

BEGIN TRANSACTION;

-- character
DROP TABLE IF EXISTS `character_fk`;
CREATE TABLE `character_fk` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `user_id` INTEGER NOT NULL,
  `level` INTEGER DEFAULT 1,
  `config` TEXT,
  FOREIGN KEY(`user_id`) REFERENCES `user`(`id`)
);

UPDATE `character`
    SET `user_id`=1
    WHERE `user_id` NOT IN (SELECT `id` FROM `user`);

INSERT INTO `character_fk`
    (`id`, `name`, `user_id`, `level`, `config`)
    SELECT `id`, `name`, `user_id`, `level`, `config`
    FROM `character`;

DROP TABLE `character`;

ALTER TABLE `character_fk` RENAME TO `character`;


-- party_characters
DROP TABLE IF EXISTS `party_characters_fk`;
CREATE TABLE `party_characters_fk` (
  `party_id` INTEGER NOT NULL,
  `character_id` INTEGER NOT NULL,
  FOREIGN KEY(`party_id`) REFERENCES `party`(`id`),
  FOREIGN KEY(`character_id`) REFERENCES `character`(`id`)
);
CREATE UNIQUE INDEX
    `par_chr` on `party_characters_fk` (`party_id`, `character_id`);

DELETE FROM `party_characters`
    WHERE `party_id` NOT IN (SELECT `id` FROM `party`)
    OR `character_id` NOT IN (SELECT `id` FROM `character`);

INSERT INTO `party_characters_fk`
    (`party_id`, `character_id`)
    SELECT `party_id`, `character_id`
    FROM `party_characters`;

DROP TABLE `party_characters`;

ALTER TABLE `party_characters_fk` RENAME TO `party_characters`;


-- encounter_monsters
DROP TABLE IF EXISTS `encounter_monsters_fk`;
CREATE TABLE `encounter_monsters_fk` (
  `encounter_id` INTEGER NOT NULL,
  `monster_id` INTEGER NOT NULL,
  `count` INTEGER DEFAULT 1,
  FOREIGN KEY(`encounter_id`) REFERENCES `encounter`(`id`),
  FOREIGN KEY(`monster_id`) REFERENCES `monster`(`id`)
);
CREATE UNIQUE INDEX
    `enc_mon` on `encounter_monsters_fk` (`encounter_id`, `monster_id`);

DELETE FROM `encounter_monsters`
    WHERE `encounter_id` NOT IN (SELECT `id` FROM `encounter`)
    OR `monster_id` NOT IN (SELECT `id` FROM `monster`);

INSERT INTO `encounter_monsters_fk`
    (`encounter_id`, `monster_id`, `count`)
    SELECT `encounter_id`, `monster_id`, `count`
    FROM `encounter_monsters`;

DROP TABLE `encounter_monsters`;

ALTER TABLE `encounter_monsters_fk` RENAME TO `encounter_monsters`;


-- adventureleaguelog
DELETE FROM `adventureleaguelog`
    WHERE `user_id` NOT IN (SELECT `id` FROM `user`)
    OR (
        `character_id` NOT NULL
        AND `character_id` NOT IN (SELECT `id` FROM `character`)
    );
CREATE TABLE `adventureleaguelog_fk` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `user_id` INTEGER NOT NULL,
  `character_id` INTEGER,
  `consumed` BOOLEAN DEFAULT false,
  `config` TEXT,
  FOREIGN KEY(`user_id`) REFERENCES `user`(`id`),
  FOREIGN KEY(`character_id`) REFERENCES `character`(`id`)
);

INSERT INTO `adventureleaguelog_fk`
    (`id`, `user_id`, `character_id`, `consumed`, `config`)
    SELECT `id`, `user_id`, `character_id`, `consumed`, `config`
    FROM `adventureleaguelog`;

DROP TABLE `adventureleaguelog`;

ALTER TABLE `adventureleaguelog_fk` RENAME TO `adventureleaguelog`;

COMMIT;
