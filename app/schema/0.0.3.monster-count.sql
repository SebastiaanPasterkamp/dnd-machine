-- Create and populate 'item' table

BEGIN TRANSACTION;
ALTER TABLE `encounter_monsters`
    ADD COLUMN `count` INTEGER DEFAULT 1;
COMMIT;
