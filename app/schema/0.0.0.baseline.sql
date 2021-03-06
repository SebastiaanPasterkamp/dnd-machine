-- Initial database

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `username` TEXT NOT NULL,
  `password` TEXT NOT NULL,
  `email` TEXT,
  `config` TEXT
);

INSERT INTO `users` (`id`, `username`, `password`, `config`)
    VALUES (1, 'admin', '$pbkdf2-sha256$6400$/N87Z6w1xjgHwPifs3buPQ$7k8ZnhgsKVR0BW5mpwgro50PlGKBcWilBXIZyHHGddg','{"role": ["admin", "dm"]}');

DROP TABLE IF EXISTS `character`;
CREATE TABLE `character` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `level` INTEGER DEFAULT 1,
  `config` TEXT
);

DROP TABLE IF EXISTS `user_characters`;
CREATE TABLE `user_characters` (
  `user_id` INTEGER,
  `character_id` INTEGER
);
CREATE UNIQUE INDEX
    `u_c` on `user_characters` (`user_id`, `character_id`);

DROP TABLE IF EXISTS `party`;
CREATE TABLE `party` (
  `id` integer primary key autoincrement,
  `name` text not null,
  `user_id` INTEGER,
  `config` TEXT
);

DROP TABLE IF EXISTS `party_characters`;
CREATE TABLE `party_characters` (
  `party_id` INTEGER,
  `character_id` INTEGER
);
CREATE UNIQUE INDEX
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

DROP TABLE IF EXISTS `encounter`;
CREATE TABLE `encounter` (
  `id` INTEGER primary key autoincrement,
  `name` text not null,
  `user_id` INTEGER,
  `size` INTEGER,
  `challenge_rating` FLOAT DEFAULT 0.0,
  `xp_rating` INTEGER DEFAULT 10,
  `xp` INTEGER DEFAULT 10,
  `config` TEXT
);

DROP TABLE IF EXISTS `encounter_monsters`;
CREATE TABLE `encounter_monsters` (
  `encounter_id` INTEGER,
  `monster_id` INTEGER
);

DROP TABLE IF EXISTS `campaign`;
CREATE TABLE `campaign` (
  `id` INTEGER primary key autoincrement,
  `name` text not null,
  `user_id` INTEGER,
  `config` TEXT
);

DROP TABLE IF EXISTS `npc`;
CREATE TABLE `npc` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `location` TEXT NOT NULL,
  `organization` TEXT NOT NULL,
  `config` TEXT
);
