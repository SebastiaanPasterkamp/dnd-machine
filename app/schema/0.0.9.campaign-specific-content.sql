-- Link campaign specific content together

ALTER TABLE `encounter`
    ADD COLUMN `campaign_id` INTEGER AFTER `user_id`
    REFERENCES `campaign`(`id`);

ALTER TABLE `monster`
    ADD COLUMN `campaign_id` INTEGER AFTER `name`
    REFERENCES `campaign`(`id`);

ALTER TABLE `npc`
    ADD COLUMN `campaign_id` INTEGER AFTER `user_id`
    REFERENCES `campaign`(`id`);
