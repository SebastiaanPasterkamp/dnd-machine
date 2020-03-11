-- Populate items table with adventuring gear

BEGIN TRANSACTION;
INSERT INTO `item` (id, type, name, config)
    VALUES (55, 'artisan', 'Alchemist''s supplies', '{"worth": {"gp": 50}, "weight": {"lb": 8}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (56, 'artisan', 'Brewer''s supplies', '{"worth": {"gp": 20}, "weight": {"lb": 9}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (57, 'artisan', 'Calligrapher''s supplies', '{"worth": {"gp": 10}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (58, 'artisan', 'Carpenter''s tools', '{"worth": {"gp": 8}, "weight": {"lb": 6}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (59, 'artisan', 'Cartographer''s tools', '{"worth": {"gp": 15}, "weight": {"lb": 6}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (60, 'artisan', 'Cobbler''s tools', '{"worth": {"gp": 5}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (61, 'artisan', 'Cook''s utensils', '{"worth": {"gp": 1}, "weight": {"lb": 8}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (62, 'artisan', 'Glassblower''s tools', '{"worth": {"gp": 30}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (63, 'artisan', 'Jeweler''s tools', '{"worth": {"gp": 25}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (64, 'artisan', 'Leatherworker''s tools', '{"worth": {"gp": 5}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (65, 'artisan', 'Mason''s tools', '{"worth": {"gp": 10}, "weight": {"lb": 8}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (66, 'artisan', 'Painter''s supplies', '{"worth": {"gp": 10}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (67, 'artisan', 'Potter''s tools', '{"worth": {"gp": 10}, "weight": {"lb": 3}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (68, 'artisan', 'Smith''s tools', '{"worth": {"gp": 20}, "weight": {"lb": 8}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (69, 'artisan', 'Tinker''s tools', '{"worth": {"gp": 50}, "weight": {"lb": 10}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (70, 'artisan', 'Weaver''s tools', '{"worth": {"gp": 1}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (71, 'artisan', 'Woodcarver''s tools', '{"worth": {"gp": 1}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (72, 'kit', 'Disguise kit', '{"worth": {"gp": 25}, "weight": {"lb": 3}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (73, 'kit', 'Forgery kit', '{"worth": {"gp": 15}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (74, 'kit', 'Herbalism kit', '{"worth": {"gp": 5}, "weight": {"lb": 3}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (75, 'kit', 'Navigator''s tools', '{"worth": {"gp": 25}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (76, 'kit', 'Poisoner''s kit', '{"worth": {"gp": 50}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (77, 'kit', 'Thieves'' tools', '{"worth": {"gp": 25}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (78, 'gaming', 'Dice set', '{"worth": {"gp": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (79, 'gaming', 'Dragonchess set', '{"worth": {"gp": 1}, "weight": {"lb": 0.5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (80, 'gaming', 'Playing card set', '{"worth": {"sp": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (81, 'gaming', 'Three-Dragon Ante set', '{"worth": {"gp": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (82, 'musical', 'Bagpipes', '{"worth": {"gp": 30}, "weight": {"lb": 6}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (83, 'musical', 'Drum', '{"worth": {"gp": 6}, "weight": {"lb": 3}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (84, 'musical', 'Dulcimer', '{"worth": {"gp": 25}, "weight": {"lb": 10}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (85, 'musical', 'Flute', '{"worth": {"gp": 2}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (86, 'musical', 'Lute', '{"worth": {"gp": 35}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (87, 'musical', 'Lyre', '{"worth": {"gp": 30}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (88, 'musical', 'Horn', '{"worth": {"gp": 3}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (89, 'musical', 'Pan flute', '{"worth": {"gp": 12}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (90, 'musical', 'Shawm', '{"worth": {"gp": 2}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (91, 'musical', 'Viol', '{"worth": {"gp": 30}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (92, 'trinket', 'A mummified goblin hand', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (93, 'trinket', 'A piece of crystal that faintly glows in the moonlight', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (94, 'trinket', 'A gold coin minted in an unknown land', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (95, 'trinket', 'A diary written in a language you don''t know', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (96, 'trinket', 'A brass ring that never tarnishes', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (97, 'trinket', 'An old chess piece made from glass', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (98, 'trinket', 'A pair of knucklebone dice, each with a skull symbol on the side that would normally show six pips', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (99, 'trinket', 'A small idol depicting a nightmarish creature that gives you unsettling dreams when you sleep near it', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (100, 'trinket', 'A rope necklace from which dangles four mummified elf fingers', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (101, 'trinket', 'The deed for a parcel of land in a realm unknown to you', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (102, 'trinket', 'A 1-ounce block made from an unknown material', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (103, 'trinket', 'A small cloth doll skewered with needles', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (104, 'trinket', 'A tooth from an unknown beast', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (105, 'trinket', 'An enormous scale, perhaps from a dragon', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (106, 'trinket', 'A bright green feather', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (107, 'trinket', 'An old divination card bearing your likeness', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (108, 'trinket', 'A glass orb filled with moving smoke', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (109, 'trinket', 'A 1-pound egg with a bright red shell', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (110, 'trinket', 'A pipe that blows bubbles', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (111, 'trinket', 'A glass jar containing a weird bit of flesh floating in pickling fluid', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (112, 'trinket', 'A tiny gnome-crafted music box that plays a song you dimly remember from your childhood', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (113, 'trinket', 'A small wooden statuette of a smug halfling', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (114, 'trinket', 'A brass orb etched with strange runes', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (115, 'trinket', 'A multicolored stone disk', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (116, 'trinket', 'A tiny silver icon of a raven', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (117, 'trinket', 'A bag containing forty-seven humanoid teeth, one of which is rotten', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (118, 'trinket', 'A shard of obsidian that always feels warm to the touch', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (119, 'trinket', 'A dragon''s bony talon hanging from a plain leather necklace', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (120, 'trinket', 'A pair of old socks', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (121, 'trinket', 'A blank book whose pages refuse to hold ink, chalk, graphite, or any other substance or marking', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (122, 'trinket', 'A silver badge in the shape of a five-pointed star', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (123, 'trinket', 'A knife that belonged to a relative', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (124, 'trinket', 'A glass vial filled with nail clippings', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (125, 'trinket', 'A rectangular metal device with two tiny metal cups on one end that throws sparks when wet', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (126, 'trinket', 'A white, sequined glove sized for a human', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (127, 'trinket', 'A vest with one hundred tiny pockets', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (128, 'trinket', 'A small, weightless stone block', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (129, 'trinket', 'A tiny sketch portrait of a goblin', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (130, 'trinket', 'An empty glass vial that smells of perfume when opened', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (131, 'trinket', 'A gemstone that looks like a lump of coal when examined by anyone but you', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (132, 'trinket', 'A scrap of cloth from an old banner', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (133, 'trinket', 'A rank insignia from a lost legionnaire', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (134, 'trinket', 'A tiny silver bell without a clapper', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (135, 'trinket', 'A mechanical canary inside a gnome-crafted lamp', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (136, 'trinket', 'A tiny chest carved to look like it has numerous feet on the bottom', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (137, 'trinket', 'A dead sprite inside a clear glass bottle', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (138, 'trinket', 'A metal can that has no opening but sounds as if it is filled with liquid, sand, spiders, or broken glass (your choice)', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (139, 'trinket', 'A glass orb filled with water, in which swims a clockwork goldfish', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (140, 'trinket', 'A silver spoon with an M engraved on the handle', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (141, 'trinket', 'A whistle made from gold-colored wood', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (142, 'trinket', 'A dead scarab beetle the size of your hand', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (143, 'trinket', 'Two toy soldiers, one with a missing head', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (144, 'trinket', 'A small box filled with different-sized buttons', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (145, 'trinket', 'A candle that can''t be lit', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (146, 'trinket', 'A tiny cage with no door', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (147, 'trinket', 'An old key', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (148, 'trinket', 'An indecipherable treasure map', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (149, 'trinket', 'A hilt from a broken sword', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (150, 'trinket', 'A rabbit''s foot', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (151, 'trinket', 'A glass eye', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (152, 'trinket', 'A cameo carved in the likeness of a hideous person', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (153, 'trinket', 'A silver skull the size of a coin', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (154, 'trinket', 'An alabaster mask', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (155, 'trinket', 'A pyramid of sticky black incense that smells very bad', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (156, 'trinket', 'A nightcap that, when worn, gives you pleasant dreams', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (157, 'trinket', 'A single caltrop made from bone', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (158, 'trinket', 'A gold monocle frame without the lens', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (159, 'trinket', 'A 1-inch cube, each side painted a different color', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (160, 'trinket', 'A crystal knob from a door', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (161, 'trinket', 'A small packet filled with pink dust', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (162, 'trinket', 'A fragment of a beautiful song, written as musical notes on two pieces of parchment', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (163, 'trinket', 'A silver teardrop earring made from a real teardrop', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (164, 'trinket', 'The shell of an egg painted with scenes of human misery in disturbing detail', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (165, 'trinket', 'A fan that, when unfolded, shows a sleeping cat', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (166, 'trinket', 'A set of bone pipes', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (167, 'trinket', 'A four-leaf clover pressed inside a book discussing manners and etiquette', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (168, 'trinket', 'A sheet of parchment upon which is drawn a complex mechanical contraption', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (169, 'trinket', 'An ornate scabbard that fits no blade you have found so far', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (170, 'trinket', 'An invitation to a party where a murder happened', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (171, 'trinket', 'A bronze pentacle with an etching of a rat''s head in its center', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (172, 'trinket', 'A purple handkerchief embroidered with the name of a powerful archmage', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (173, 'trinket', 'Half of a floorplan for a temple, castle, or some other structure', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (174, 'trinket', 'A bit of folded cloth that, when unfolded, turns into a stylish cap', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (175, 'trinket', 'A receipt of deposit at a bank in a far-flung city', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (176, 'trinket', 'A diary with seven missing pages', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (177, 'trinket', 'An empty silver snuffbox bearing an inscription on the surface that says "dreams"', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (178, 'trinket', 'An iron holy symbol devoted to an unknown god', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (179, 'trinket', 'A book that tells the story of a legendary hero''s rise and fall, with the last chapter missing', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (180, 'trinket', 'A vial of dragon blood', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (181, 'trinket', 'An ancient arrow of elven design', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (182, 'trinket', 'A needle that never bends', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (183, 'trinket', 'An ornate brooch of dwarven design', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (184, 'trinket', 'An empty wine bottle bearing a pretty label that says, "The Wizard of Wines Winery, Red Dragon Crush, 331422-W"', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (185, 'trinket', 'A mosaic tile with a multicolored, glazed surface', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (186, 'trinket', 'A petrified mouse', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (187, 'trinket', 'A black pirate flag adorned with a dragon''s skull and crossbones', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (188, 'trinket', 'A tiny mechanical crab or spider that moves about when it''s not being observed', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (189, 'trinket', 'A glass jar containing lard with a label that reads, "Griffon Grease"', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (190, 'trinket', 'A wooden box with a ceramic bottom that holds a living worm with a head on each end of its body', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (191, 'trinket', 'A metal urn containing the ashes of a hero', '{}');

INSERT INTO `item` (id, type, name, config)
    VALUES (192, 'gear', 'Abacus', '{"cost": {"gp": 2}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (193, 'gear', 'Acid (vial)', '{"cost": {"gp": 25}, "group": "vial", "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (194, 'gear', 'Alchemist''s fire (flask)', '{"cost": {"gp": 50}, "group": "vial", "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (195, 'gear', 'Antitoxin (vial)', '{"cost": {"gp": 50}, "group": "vial"}');

INSERT INTO `item` (id, type, name, config)
    VALUES (196, 'gear', 'Arrows (20)', '{"cost": {"gp": 1}, "group": "ammunition", "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (197, 'gear', 'Blowgun needles (50)', '{"cost": {"gp": 1}, "group": "ammunition", "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (198, 'gear', 'Crossbow bolts (20)', '{"cost": {"gp": 1}, "group": "ammunition", "weight": {"lb": 1.5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (199, 'gear', 'Sling bullets (20)', '{"cost": {"cp": 4}, "group": "ammunition", "weight": {"lb": 1.5}}');

INSERT INTO `item` (id, type, name, config)
    VALUES (200, 'gear', 'Crystal', '{"cost": {"gp": 10}, "group": "arcane focus", "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (201, 'gear', 'Orb', '{"cost": {"gp": 20}, "group": "arcane focus", "weight": {"lb": 3}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (202, 'gear', 'Rod', '{"cost": {"gp": 10}, "group": "arcane focus", "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (203, 'gear', 'Staff', '{"cost": {"gp": 5}, "group": "arcane focus", "weight": {"lb": 4}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (204, 'gear', 'Wand', '{"cost": {"gp": 10}, "group": "arcane focus", "weight": {"lb": 1}}');

INSERT INTO `item` (id, type, name, config)
    VALUES (205, 'gear', 'Backpack', '{"cost": {"gp": 2}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (206, 'gear', 'Ball bearings (bag of 1,000)', '{"cost": {"gp": 1}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (207, 'gear', 'Barrel', '{"cost": {"gp": 2}, "weight": {"lb": 70}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (208, 'gear', 'Basket', '{"cost": {"sp": 4}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (209, 'gear', 'Bedroll', '{"cost": {"gp": 1}, "weight": {"lb": 7}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (210, 'gear', 'Bell', '{"cost": {"gp": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (211, 'gear', 'Blanket', '{"cost": {"sp": 5}, "weight": {"lb": 3}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (212, 'gear', 'Block and tackle', '{"cost": {"gp": 1}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (213, 'gear', 'Book', '{"cost": {"gp": 25}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (214, 'gear', 'Bottle, glass', '{"cost": {"gp": 2}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (215, 'gear', 'Bucket', '{"cost": {"cp": 5}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (216, 'gear', 'Caltrops (bag of 20)', '{"cost": {"gp": 1}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (217, 'gear', 'Candle', '{"cost": {"cp": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (218, 'gear', 'Case, crossbow bolt', '{"cost": {"gp": 1}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (219, 'gear', 'Case, map or scroll', '{"cost": {"gp": 1}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (220, 'gear', 'Chain (10 feet)', '{"cost": {"gp": 5}, "weight": {"lb": 10}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (221, 'gear', 'Chalk (1 piece)', '{"cost": {"cp": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (222, 'gear', 'Chest', '{"cost": {"gp": 5}, "weight": {"lb": 25}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (223, 'gear', 'Climber’s kit', '{"cost": {"gp": 25}, "weight": {"lb": 12}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (224, 'gear', 'Clothes, common', '{"cost": {"sp": 5}, "weight": {"lb": 3}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (225, 'gear', 'Clothes, costume', '{"cost": {"gp": 5}, "weight": {"lb": 4}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (226, 'gear', 'Clothes, fine', '{"cost": {"gp": 15}, "weight": {"lb": 6}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (227, 'gear', 'Clothes, traveler’s', '{"cost": {"gp": 2}, "weight": {"lb": 4}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (228, 'gear', 'Component pouch', '{"cost": {"gp": 25}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (229, 'gear', 'Crowbar', '{"cost": {"gp": 2}, "weight": {"lb": 5}}');

INSERT INTO `item` (id, type, name, config)
    VALUES (230, 'gear', 'Sprig of mistletoe', '{"cost": {"gp": 1}, "group": "druidic focus"}');
INSERT INTO `item` (id, type, name, config)
    VALUES (231, 'gear', 'Totem', '{"cost": {"gp": 5}, "group": "druidic focus"}');
INSERT INTO `item` (id, type, name, config)
    VALUES (232, 'gear', 'Wooden staff', '{"cost": {"gp": 5}, "group": "druidic focus", "weight": {"lb": 4}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (233, 'gear', 'Yew wand', '{"cost": {"gp": 10}, "group": "druidic focus", "weight": {"lb": 1}}');

INSERT INTO `item` (id, type, name, config)
    VALUES (234, 'gear', 'Fishing tackle', '{"cost": {"gp": 1}, "weight": {"lb": 4}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (235, 'gear', 'Flask or tankard', '{"cost": {"cp": 2}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (236, 'gear', 'Grappling hook', '{"cost": {"gp": 2}, "weight": {"lb": 4}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (237, 'gear', 'Hammer', '{"cost": {"gp": 1}, "weight": {"lb": 3}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (238, 'gear', 'Hammer, sledge', '{"cost": {"gp": 2}, "weight": {"lb": 10}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (239, 'gear', 'Healer’s kit', '{"cost": {"gp": 5}, "weight": {"lb": 3}}');

INSERT INTO `item` (id, type, name, config)
    VALUES (240, 'gear', 'Amulet', '{"cost": {"gp": 5}, "group": "holy symbol", "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (241, 'gear', 'Emblem', '{"cost": {"gp": 5}, "group": "holy symbol"}');
INSERT INTO `item` (id, type, name, config)
    VALUES (242, 'gear', 'Reliquary', '{"cost": {"gp": 5}, "group": "holy symbol", "weight": {"lb": 2}}');

INSERT INTO `item` (id, type, name, config)
    VALUES (243, 'gear', 'Holy water (flask)', '{"cost": {"gp": 25}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (244, 'gear', 'Hourglass', '{"cost": {"gp": 25}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (245, 'gear', 'Hunting trap', '{"cost": {"gp": 5}, "weight": {"lb": 25}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (246, 'gear', 'Ink (1 ounce bottle)', '{"cost": {"gp": 10}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (247, 'gear', 'Ink pen', '{"cost": {"cp": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (248, 'gear', 'Jug or pitcher', '{"cost": {"cp": 2}, "weight": {"lb": 4}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (249, 'gear', 'Ladder (10-foot)', '{"cost": {"sp": 1}, "weight": {"lb": 25}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (250, 'gear', 'Lamp', '{"cost": {"sp": 5}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (251, 'gear', 'Lantern, bullseye', '{"cost": {"gp": 10}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (252, 'gear', 'Lantern, hooded', '{"cost": {"gp": 5}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (253, 'gear', 'Lock', '{"cost": {"gp": 10}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (254, 'gear', 'Magnifying glass', '{"cost": {"gp": 100}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (255, 'gear', 'Manacles', '{"cost": {"gp": 2}, "weight": {"lb": 6}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (256, 'gear', 'Mess kit', '{"cost": {"sp": 2}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (257, 'gear', 'Mirror, steel', '{"cost": {"gp": 5}, "weight": {"lb": 0.5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (258, 'gear', 'Oil (flask)', '{"cost": {"sp": 1}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (259, 'gear', 'Paper (one sheet)', '{"cost": {"sp": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (260, 'gear', 'Parchment (one sheet)', '{"cost": {"sp": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (261, 'gear', 'Perfume (vial)', '{"cost": {"gp": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (262, 'gear', 'Pick, miner’s', '{"cost": {"gp": 2}, "weight": {"lb": 10}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (263, 'gear', 'Piton', '{"cost": {"cp": 5}, "weight": {"lb": 0.25}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (264, 'gear', 'Poison, basic (vial)', '{"cost": {"gp": 100}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (265, 'gear', 'Pole (10-foot)', '{"cost": {"cp": 5}, "weight": {"lb": 7}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (266, 'gear', 'Pot, iron', '{"cost": {"gp": 2}, "weight": {"lb": 10}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (267, 'gear', 'Potion of healing', '{"cost": {"gp": 50}, "weight": {"lb": 0.5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (268, 'gear', 'Pouch', '{"cost": {"sp": 5}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (269, 'gear', 'Quiver', '{"cost": {"gp": 1}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (270, 'gear', 'Ram, portable', '{"cost": {"gp": 4}, "weight": {"lb": 35}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (271, 'gear', 'Rations (1 day)', '{"cost": {"sp": 5}, "weight": {"lb": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (272, 'gear', 'Robes', '{"cost": {"gp": 1}, "weight": {"lb": 4}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (273, 'gear', 'Rope, hempen (50 feet)', '{"cost": {"gp": 1}, "weight": {"lb": 10}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (274, 'gear', 'Rope, silk (50 feet)', '{"cost": {"gp": 10}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (275, 'gear', 'Sack', '{"cost": {"cp": 1}, "weight": {"lb": 0.5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (276, 'gear', 'Scale, merchant’s', '{"cost": {"gp": 5}, "weight": {"lb": 3}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (277, 'gear', 'Sealing wax', '{"cost": {"sp": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (278, 'gear', 'Shovel', '{"cost": {"gp": 2}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (279, 'gear', 'Signal whistle', '{"cost": {"cp": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (280, 'gear', 'Signet ring', '{"cost": {"gp": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (281, 'gear', 'Soap', '{"cost": {"cp": 2}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (282, 'gear', 'Spellbook', '{"cost": {"gp": 50}, "weight": {"lb": 3}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (283, 'gear', 'Spikes, iron (10)', '{"cost": {"gp": 1}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (284, 'gear', 'Spyglass', '{"cost": {"gp": 1000}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (285, 'gear', 'Tent, two-person', '{"cost": {"gp": 2}, "weight": {"lb": 20}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (286, 'gear', 'Tinderbox', '{"cost": {"sp": 5}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (287, 'gear', 'Torch', '{"cost": {"cp": 1}, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (288, 'gear', 'Vial', '{"cost": {"gp": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (289, 'gear', 'Waterskin', '{"cost": {"sp": 2}, "weight": {"lb": 5}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (291, 'gear', 'String (10 ft)', '{"sp": 1}');
INSERT INTO `item` (id, type, name, config)
    VALUES (292, 'gear', 'Block of incense', '{"gp": 1}');
INSERT INTO `item` (id, type, name, config)
    VALUES (293, 'gear', 'Censer', '{"gp": 5, "weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (294, 'gear', 'Vestments', '{"gp": 15, "weight": {"lb": 6}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (295, 'gear', 'Sand (little bag)', '{"weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (296, 'gear', 'Small knife', '{"weight": {"lb": 1}}');
INSERT INTO `item` (id, type, name, config)
    VALUES (297, 'gear', 'Alms box', '{}');
INSERT INTO `item` (id, type, name, config)
    VALUES (298, 'gear', 'Book of lore', '{"weight": {"lb": 1}}');
COMMIT;
