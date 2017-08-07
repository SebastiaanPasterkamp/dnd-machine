DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `username` TEXT NOT NULL,
  `password` TEXT NOT NULL,
  `email` TEXT,
  `config` TEXT
);

DROP TABLE IF EXISTS `character`;
CREATE TABLE `character` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `level` INTEGER DEFAULT 1,
  `config` TEXT
);

DROP TABLE IF EXISTS `party`;
CREATE TABLE `party` (
  `id` integer primary key autoincrement,
  `name` text not null,
  `config` TEXT
);

drop table if exists `party_characters`;
create table `party_characters` (
  `party_id` INTEGER,
  `character_id` INTEGER
);
create unique index
    `p_c` on `party_characters` (`party_id`, `character_id`);

DROP TABLE IF EXISTS `monster`;
CREATE TABLE `monster` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `size` TEXT,
  `challenge_rating` FLOAT DEFAULT 0.0,
  `xp_rating` INTEGER DEFAULT 10,
  `xp` INTEGER DEFAULT 10,
  `config` TEXT
);

drop table if exists `encounter`;
create table `encounter` (
  `id` INTEGER primary key autoincrement,
  `name` text not null,
  `size` INTEGER,
  `challenge_rating` FLOAT DEFAULT 0.0,
  `xp_rating` INTEGER DEFAULT 10,
  `xp` INTEGER DEFAULT 10,
  `config` TEXT
);

drop table if exists `encounter_monsters`;
create table `encounter_monsters` (
  `encounter_id` INTEGER,
  `monster_id` INTEGER
);
