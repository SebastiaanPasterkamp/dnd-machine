-- Create and populate 'item' table

DROP TABLE IF EXISTS `item`;
CREATE TABLE `item` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `type` TEXT NOT NULL,
  `name` TEXT NOT NULL,
  `config` TEXT
);

BEGIN TRANSACTION;
INSERT INTO `item` (id, type, name, config)
    VALUES (0, 'simple melee', 'Club', '{"property": ["light"], "cost": {"sp": 1}, "damage": {"dice_count": 1, "type": "bludgeoning", "dice_size": 4}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (1, 'simple melee', 'Dagger', '{"property": ["thrown", "finesse", "light"], "range": {"max": 60, "min": 20}, "cost": {"gp": 2}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 4}, "weight": {"lb": 1.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (2, '', 'Greatclub', '{"weight": {"lb": 10.0}, "damage": {"dice_count": 1, "type": "", "dice_size": 8}, "range": {"max": 5, "min": 5}, "cost": {"sp": 2}, "property": ["two-handed"], "versatile": {"dice_count": 1, "type": "", "dice_size": 4}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (3, 'simple melee', 'Greatclub', '{"property": ["two-handed"], "cost": {"sp": 2, "gp": 0}, "damage": {"dice_count": 1, "type": "bludgeoning", "dice_size": 8}, "weight": {"lb": 10.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (4, 'simple melee', 'Handaxe', '{"property": ["light", "thrown"], "range": {"max": 60, "min": 20}, "cost": {"gp": 5}, "damage": {"dice_count": 1, "type": "slashing", "dice_size": 6}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (5, 'simple melee', 'Javelin', '{"property": ["thrown"], "range": {"max": 120, "min": 30}, "cost": {"sp": 5, "gp": 0}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 6}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (6, 'simple melee', 'Light Hammer', '{"property": ["light", "thrown"], "range": {"max": 60, "min": 20}, "cost": {"gp": 2}, "damage": {"dice_count": 1, "type": "bludgeoning", "dice_size": 4}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (7, 'simple melee', 'Mace', '{"property": [], "cost": {"gp": 5}, "damage": {"dice_count": 1, "type": "bludgeoning", "dice_size": 6}, "weight": {"lb": 4.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (8, 'simple melee', 'Quarterstaff', '{"property": ["versatile"], "cost": {"sp": 2}, "versatile": {"dice_count": 1, "type": "bludgeoning", "dice_size": 8}, "damage": {"dice_count": 1, "type": "bludgeoning", "dice_size": 6}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (9, 'simple melee', 'Sickle', '{"property": ["light"], "cost": {"gp": 1}, "damage": {"dice_count": 1, "type": "slashing", "dice_size": 4}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (10, 'simple melee', 'Spear', '{"weight": {"lb": 3.0}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 6}, "range": {"max": 60, "min": 20}, "cost": {"gp": 1}, "property": ["thrown", "versatile"], "versatile": {"dice_count": 1, "type": "piercing", "dice_size": 8}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (11, 'simple melee', 'Unarmed Strike', '{"property": [], "cost": {}, "damage": {"bonus": "1", "dice_count": 0, "type": "bludgeoning", "dice_bonus": "1", "dice_size": 4}, "weight": {}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (12, 'simple ranged', 'Crossbow, light', '{"property": ["ammunition", "loading", "two-handed"], "range": {"max": 320, "min": 80}, "cost": {"gp": 25}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 8}, "weight": {"lb": 5.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (13, 'simple ranged', 'Dart', '{"property": ["finesse", "thrown"], "range": {"max": 60, "min": 20}, "cost": {"cp": 5}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 4}, "weight": {"lb": 0.25}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (14, 'simple ranged', 'Shortbow', '{"property": ["ammunition", "two-handed"], "range": {"max": 320, "min": 80}, "cost": {"gp": 25}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 6}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (15, 'simple ranged', 'Sling', '{"property": ["ammunition"], "range": {"max": 120, "min": 30}, "cost": {"sp": 1}, "damage": {"dice_count": 1, "type": "bludgeoning", "dice_size": 4}, "weight": {}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (16, 'martial melee', 'Battleaxe', '{"property": ["versatile"], "cost": {"gp": 10}, "versatile": {"dice_count": 1, "type": "slashing", "dice_size": 10}, "damage": {"dice_count": 1, "type": "slashing", "dice_size": 8}, "weight": {"lb": 4.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (17, 'martial melee', 'Flail', '{"property": [], "cost": {"gp": 10}, "damage": {"dice_count": 1, "type": "bludgeoning", "dice_size": 8}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (18, 'martial melee', 'Glaive', '{"property": ["heavy", "reach", "two-handed"], "cost": {"gp": 20}, "damage": {"dice_count": 1, "type": "bludgeoning", "dice_size": 10}, "weight": {"lb": 6.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (19, 'martial melee', 'Greataxe', '{"property": ["two-handed", "heavy"], "cost": {"gp": 30}, "damage": {"dice_count": 1, "type": "slashing", "dice_size": 12}, "weight": {"lb": 7.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (20, 'martial melee', 'Halbert', '{"property": ["reach", "heavy", "two-handed"], "cost": {"gp": 20}, "damage": {"dice_count": 1, "type": "slashing", "dice_size": 10}, "weight": {"lb": 6.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (21, 'martial melee', 'Lance', '{"property": ["reach", "special"], "cost": {"gp": 10}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 12}, "weight": {"lb": 6.0}, "description": "You have **Disadvantage** when you use a lance\nto attack a target within 5 feet of you. Also, a lance\nrequires two hands to wield when you aren''t mounted.\n"}');
INSERT INTO `item` (id, type, name, config)
    VALUES (22, 'martial melee', 'Longsword', '{"property": ["versatile"], "cost": {"gp": 15}, "versatile": {"dice_count": 1, "type": "bludgeoning", "dice_size": 10}, "damage": {"dice_count": 1, "type": "slashing", "dice_size": 8}, "weight": {"lb": 3.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (23, 'martial melee', 'Maul', '{"property": ["heavy", "two-handed"], "cost": {"gp": 10}, "damage": {"dice_count": 2, "type": "bludgeoning", "dice_size": 6}, "weight": {"lb": 10.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (24, 'martial melee', 'Morningstar', '{"property": ["reach", "heavy", "two-handed"], "cost": {"gp": 15}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 10}, "weight": {"lb": 18.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (25, 'martial melee', 'Rapier', '{"property": ["finesse"], "cost": {"gp": 25}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 8}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (26, 'martial melee', 'Scimitar', '{"property": ["finesse", "light"], "cost": {"gp": 25}, "damage": {"dice_count": 1, "type": "slashing", "dice_size": 6}, "weight": {"lb": 3.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (27, 'martial melee', 'Shortsword', '{"property": ["finesse", "light"], "cost": {"gp": 10}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 6}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (28, 'martial melee', 'Greatsword', '{"property": ["heavy", "two-handed"], "cost": {"gp": 50}, "damage": {"dice_count": 2, "type": "slashing", "dice_size": 6}, "weight": {}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (29, 'martial melee', 'Pike', '{"property": ["heavy", "reach", "two-handed"], "cost": {"gp": 5}, "damage": {"dice_count": 1, "type": "slashing", "dice_size": 10}, "weight": {"lb": 18.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (30, 'martial melee', 'Trident', '{"weight": {"lb": 4.0}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 6}, "range": {"max": 60, "min": 20}, "cost": {"gp": 5}, "property": ["thrown", "versatile"], "versatile": {"dice_count": 1, "type": "piercing", "dice_size": 8}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (31, 'martial melee', 'War Pick', '{"property": [], "cost": {"gp": 5}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 8}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (32, 'martial melee', 'Warhammer', '{"property": ["versatile"], "cost": {"gp": 15}, "versatile": {"dice_count": 1, "type": "bludgeoning", "dice_size": 10}, "damage": {"dice_count": 1, "type": "bludgeoning", "dice_size": 8}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (33, 'martial melee', 'Whip', '{"property": ["finesse", "reach"], "cost": {"gp": 2}, "damage": {"dice_count": 1, "type": "slashing", "dice_size": 4}, "weight": {"lb": 3.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (34, 'martial ranged', 'Blowgun', '{"property": ["ammunition", "loading"], "range": {"max": 100, "min": 25}, "cost": {"gp": 10}, "damage": {"dice_bonus": "1", "dice_count": 0, "type": "piercing", "dice_size": 4}, "weight": {}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (35, 'martial ranged', 'Crossbow, hand', '{"property": ["ammunition", "light", "loading"], "range": {"max": 120, "min": 30}, "cost": {"gp": 75}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 6}, "weight": {"lb": 3.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (36, 'martial ranged', 'Crossbow, Heavy', '{"property": ["ammunition", "heavy", "two-handed", "loading"], "range": {"max": 400, "min": 100}, "cost": {"gp": 50}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 10}, "weight": {"lb": 18.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (37, 'martial ranged', 'Longbow', '{"property": ["ammunition", "heavy", "two-handed"], "range": {"max": 600, "min": 150}, "cost": {"gp": 50}, "damage": {"dice_count": 1, "type": "piercing", "dice_size": 8}, "weight": {"lb": 2.0}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (38, 'martial ranged', 'Net', '{"description": "A Large or smaller creature hit by a net is restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger. A creature can use its action to make a DC `10` **Strength** check, freeing itself or another creature within its reach on a success. Dealing `5` slashing damage to the net (AC `10`) also frees the creature without harming it, ending the effect and destroying the net.\n\nWhen you use an action, bonus action, or reaction to attack with a net, you can make only one attack regardless of the number of attacks you can normally make.", "weight": {"lb": 2.0}, "damage": {"dice_count": 0, "type": "", "dice_size": 4}, "range": {"max": 15, "min": 5}, "cost": {"gp": 1}, "property": ["thrown", "special"]}');
INSERT INTO `item` (id, type, name, config)
    VALUES (39, 'light', 'Padded Armor', '{"requirements": {}, "weight": {"lb": 8.0}, "damage": {"dice_count": "1", "type": "slashing", "dice_size": "4"}, "cost": {"gp": 5}, "formula": "11 + statistics.modifiers.dexterity", "property": [], "disadvantage": true}');
INSERT INTO `item` (id, type, name, config)
    VALUES (40, 'light', 'Leather Armor', '{"formula": "11 + statistics.modifiers.dexterity", "cost": {"gp": 10}, "requirements": {}, "weight": {"lb": 10.0}, "disadvantage": false}');
INSERT INTO `item` (id, type, name, config)
    VALUES (41, 'light', 'Studded Leather', '{"formula": "12 + statistics.modifiers.dexterity", "cost": {"gp": 45}, "requirements": {}, "weight": {"lb": 13.0}, "disadvantage": false}');
INSERT INTO `item` (id, type, name, config)
    VALUES (42, 'medium', 'Hide Armor', '{"formula": "12 + min(2, statistics.modifiers.dexterity)", "cost": {"gp": 10}, "requirements": {}, "weight": {"lb": 12.0}, "disadvantage": false}');
INSERT INTO `item` (id, type, name, config)
    VALUES (43, 'medium', 'Chain Shirt', '{"formula": "13 + min(2, statistics.modifiers.dexterity)", "cost": {"gp": 50}, "requirements": {}, "weight": {"lb": 20.0}, "disadvantage": false}');
INSERT INTO `item` (id, type, name, config)
    VALUES (44, 'medium', 'Scale Mail', '{"formula": "14 + min(2, statistics.modifiers.dexterity)", "cost": {"gp": 50}, "requirements": {}, "weight": {"lb": 45.0}, "disadvantage": true}');
INSERT INTO `item` (id, type, name, config)
    VALUES (45, 'medium', 'Breastplate', '{"formula": "14 + min(2, statistics.modifiers.dexterity)", "cost": {"gp": 400}, "requirements": {}, "weight": {"lb": 20.0}, "disadvantage": false}');
INSERT INTO `item` (id, type, name, config)
    VALUES (46, 'medium', 'Half Plate', '{"formula": "15 + min(2, statistics.modifiers.dexterity)", "cost": {"gp": 750}, "requirements": {}, "weight": {"lb": 40.0}, "disadvantage": true}');
INSERT INTO `item` (id, type, name, config)
    VALUES (47, 'heavy', 'Ring Mail', '{"cost": {"gp": 30}, "requirements": {}, "value": 14, "weight": {"lb": 40.0}, "disadvantage": true}');
INSERT INTO `item` (id, type, name, config)
    VALUES (48, 'heavy', 'Chain Mail', '{"cost": {"gp": 75}, "requirements": {"strength": 13}, "value": 16, "weight": {"lb": 55.0}, "disadvantage": true}');
INSERT INTO `item` (id, type, name, config)
    VALUES (49, 'heavy', 'Splint', '{"cost": {"gp": 200}, "requirements": {"strength": 15}, "value": 17, "weight": {"lb": 60.0}, "disadvantage": true}');
INSERT INTO `item` (id, type, name, config)
    VALUES (50, 'heavy', 'Plate', '{"cost": {"gp": 1500}, "requirements": {"strength": 15}, "value": 18, "weight": {"lb": 65.0}, "disadvantage": true}');
INSERT INTO `item` (id, type, name, config)
    VALUES (51, 'shield', 'Shield', '{"bonus": 2, "cost": {"gp": 10}, "requirements": {}, "weight": {"lb": 6.0}, "disadvantage": false}');
COMMIT;
