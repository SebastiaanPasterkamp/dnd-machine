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
COMMIT;
