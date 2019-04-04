-- Rename users to user

BEGIN TRANSACTION;

ALTER TABLE `users` RENAME TO `user`;

COMMIT;
