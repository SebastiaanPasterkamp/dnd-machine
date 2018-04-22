-- Remove user_characters in favor of character.user_id

ALTER TABLE `character`
    ADD COLUMN `user_id` INTEGER AFTER `name`;

DROP TABLE `user_characters`;
