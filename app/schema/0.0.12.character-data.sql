-- Create and populate player data tables; (sub)race, (sub)class, background

DROP TABLE IF EXISTS `race`;
CREATE TABLE `race` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `config` TEXT
);

DROP TABLE IF EXISTS `subrace`;
CREATE TABLE `subrace` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `race_id` INTEGER NOT NULL,
  `config` TEXT,
  FOREIGN KEY(`race_id`) REFERENCES `race`(`id`)
);

DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `config` TEXT
);

DROP TABLE IF EXISTS `subclass`;
CREATE TABLE `subclass` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `class_id` INTEGER NOT NULL,
  `config` TEXT,
  FOREIGN KEY(`class_id`) REFERENCES `class`(`id`)
);

DROP TABLE IF EXISTS `background`;
CREATE TABLE `background` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `config` TEXT
);

DROP TABLE IF EXISTS `options`;
CREATE TABLE `options` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `config` TEXT
);

BEGIN TRANSACTION;
INSERT INTO `race` (id, name, config)
    VALUES (1, 'Dwarf', '{
    "config": [
        {
            "config": [
                {
                    "given": [
                        2
                    ],
                    "hidden": true,
                    "multiple": true,
                    "path": "statistics.bonus.constitution",
                    "type": "list",
                    "uuid": "c7989c39-b7b5-41d4-aad6-400484afc8fb"
                }
            ],
            "description": "Your **Constitution** score increases by 2.",
            "label": "Ability Score Increase",
            "type": "config",
            "uuid": "ac1edc9b-a9eb-4431-8b52-6fbab220d48a"
        },
        {
            "config": [
                {
                    "hidden": true,
                    "path": "size",
                    "type": "value",
                    "uuid": "64242cd6-b761-42f2-88eb-bcc4b994b790",
                    "value": "medium"
                }
            ],
            "description": "Dwarves stand between 4 and 5 feet tall and average about 150 pounds. Your size is **Medium**.",
            "label": "Size",
            "type": "config",
            "uuid": "05d5e537-8ecd-44ad-b066-ccb35bbb2055"
        },
        {
            "description": "Your base walking *speed* is **25 feet**.",
            "label": "Speed",
            "type": "config",
            "uuid": "54734758-1295-41d8-bca2-5e32a098b408"
        },
        {
            "hidden": true,
            "path": "speed",
            "type": "value",
            "uuid": "02c50a57-a363-477a-9951-65c194b01321",
            "value": 25
        },
        {
            "path": "info.Speed",
            "type": "value",
            "uuid": "820502f0-698a-433a-9a98-b7e62a4dcd62",
            "value": "Your *speed* is not reduced by wearing **heavy armor**."
        },
        {
            "label": "Darkvision",
            "path": "info.Darkvision",
            "type": "value",
            "uuid": "4ad9e96d-8240-43d8-bbbf-18be95e2d69b",
            "value": "Accustomed to life underground, you have\nsuperior vision in dark and dim conditions. You can see\nin dim light within 60 feet of you as if it were bright light,\nand in darkness as if it were dim light. You can\u2019t discern\ncolor in darkness, only shades of gray."
        },
        {
            "label": "Dwarven Resilience",
            "path": "info.Dwarven Resilience",
            "type": "value",
            "uuid": "896f5ee6-c76c-4cfb-b1d9-85eaf2787222",
            "value": "You have advantage on saving\nthrows against poison, and you have resistance against\npoison damage (explained in chapter 9)."
        },
        {
            "description": "You have proficiency with\nthe battleaxe, handaxe, light hammer, and warhammer.",
            "given": [
                16,
                4,
                6,
                32
            ],
            "label": "Dwarven Combat Training",
            "list": [
                "weapon",
                "weapon_types"
            ],
            "path": "proficiencies.weapons",
            "type": "list",
            "uuid": "2e8b2e97-6e59-416f-9dff-db9fb12e0b17"
        },
        {
            "add": 1,
            "description": "You gain proficiency with the artisan\u2019s tools of your choice: smith\u2019s tools, brewer\u2019s supplies,\nor mason\u2019s tools.",
            "filter": {
                "code": [
                    "Smith''s tools",
                    "Brewer''s supplies",
                    "Mason''s tools"
                ]
            },
            "label": "Tool Proficiency",
            "list": [
                "tools"
            ],
            "path": "proficiencies.tools",
            "type": "list",
            "uuid": "fee2ccfb-7bd7-4b0e-9486-5aad04932c59"
        },
        {
            "label": "Stonecunning",
            "path": "info.Stonecunning",
            "type": "value",
            "uuid": "0a6c9349-4c6e-46ab-85b7-5be7e3ae3ce3",
            "value": "Whenever you make an *Intelligence\n(History)* check related to the origin of stonework, you are\nconsidered proficient in the *History* skill and add double\nyour proficiency bonus to the check, instead of your normal proficiency bonus."
        },
        {
            "description": "You can speak, read, and write *Common*\nand *Dwarvish*. Dwarvish is full of hard consonants and\nguttural sounds, and those characteristics spill over into\nwhatever other language a dwarf might speak.",
            "given": [
                "common",
                "dwarvish"
            ],
            "label": "Languages",
            "list": [
                "languages"
            ],
            "path": "languages",
            "type": "list",
            "uuid": "5d362fe7-51ad-4da2-a0e5-84ced7edc2eb"
        }
    ],
    "description": "Kingdoms rich in ancient grandeur, halls carved into the\nroots of mountains, the echoing of picks and hammers\nin deep mines and blazing forges, a commitment to clan\nand tradition, and a burning hatred of goblins and orcs\u2014\nthese common threads unite all dwarves.\n\n## Short and Stout\n\nBold and hardy, dwarves are known as skilled warriors,\nminers, and workers of stone and metal. Though they\nstand well under 5 feet tall, dwarves are so broad and\ncompact that they can weigh as much as a human standing\nnearly two feet taller. Their courage and endurance are\nalso easily a match for any of the larger folk.\nDwarven skin ranges from deep brown to a paler\nhue tinged with red, but the most common shades are\nlight brown or deep tan, like certain tones of earth.\nTheir hair, worn long but in simple styles, is usually\nblack, gray, or brown, though paler dwarves often have\nred hair. Male dwarves value their beards highly and\ngroom them carefully.",
    "type": "config"
}');

INSERT INTO `class` (id, name, config)
    VALUES (1, 'Cleric', '{
    "config": [
        {
            "hidden": true,
            "path": "class",
            "type": "value",
            "uuid": "1d8c1fdd-d048-4718-95f5-f0045c4e261b",
            "value": "Cleric"
        },
        {
            "config": [
                {
                    "hidden": true,
                    "path": "hit_dice",
                    "type": "value",
                    "uuid": "df63bdd1-bc20-4577-9185-c5573a2a26cd",
                    "value": 8
                }
            ],
            "description": "`1d8` per **Cleric** level",
            "label": "Hit Dice",
            "type": "config",
            "uuid": "51398dcd-a8e4-459d-9c8e-6cb65faa4423"
        },
        {
            "config": [
                {
                    "hidden": true,
                    "path": "computed.hit_points.formula",
                    "type": "value",
                    "uuid": "0a16619d-067f-4302-a9e6-5c796d95daeb",
                    "value": "(8 + statistics.modifiers.constitution) + (5 + statistics.modifiers.constitution) * (level - 1)"
                }
            ],
            "description": "* **At 1st Level**: `8` + your **Constitution modifier**\n* **At Higher Levels**: `1d8` (or `5`) + your\n**Constitution modifier** per **cleric** level after 1st",
            "label": "Hit Points",
            "type": "config",
            "uuid": "19f4ee8d-d8b6-4d1d-8249-9467809fa8ef"
        },
        {
            "config": [
                {
                    "description": "Light armor, medium armor, shields",
                    "given": [
                        "shield",
                        "light",
                        "medium"
                    ],
                    "label": "Armor",
                    "list": [
                        "armor_types",
                        "armor"
                    ],
                    "path": "proficiencies.armor",
                    "type": "list",
                    "uuid": "65a09a00-ced6-4506-b81e-5943b09df0e3"
                },
                {
                    "description": "Simple weapons",
                    "given": [
                        "simple melee",
                        "simple ranged"
                    ],
                    "label": "Weapons",
                    "list": [
                        "weapon",
                        "weapon_types"
                    ],
                    "path": "proficiencies.weapons",
                    "type": "list",
                    "uuid": "78b36e51-b997-42c6-993f-0a57bdc74160"
                },
                {
                    "description": "None",
                    "label": "Tools",
                    "type": "config",
                    "uuid": "9cf9b768-88f2-4ec5-be30-88a7dfcfa0f3"
                },
                {
                    "description": "Wisdom, Charisma",
                    "given": [
                        "wisdom",
                        "charisma"
                    ],
                    "label": "Saving Throws",
                    "list": [
                        "statistics"
                    ],
                    "path": "proficiencies.saving_throws",
                    "type": "list",
                    "uuid": "3938ca0c-8d0a-40a0-8915-de149fdba1d9"
                },
                {
                    "add": 2,
                    "description": "Choose two from History, Insight, Medicine,\nPersuasion, and Religion",
                    "filter": {
                        "code": [
                            "history",
                            "insight",
                            "medicine",
                            "persuasion",
                            "religion"
                        ]
                    },
                    "given": [],
                    "label": "Skills",
                    "list": [
                        "skills"
                    ],
                    "path": "proficiencies.skills",
                    "type": "list",
                    "uuid": "0ed03302-acc0-4394-8bc4-cb87787512e9"
                }
            ],
            "label": "Proficiencies",
            "type": "config",
            "uuid": "c8980214-0f16-493d-8b98-7577a19eadd9"
        },
        {
            "config": [
                {
                    "description": "(a) a mace or (b) a warhammer (if proficient)",
                    "label": "Weapons",
                    "options": [
                        {
                            "given": [
                                7
                            ],
                            "label": "Mace",
                            "list": [
                                "weapon"
                            ],
                            "multiple": true,
                            "path": "equipment",
                            "type": "list",
                            "uuid": "2eca488b-8963-4187-9d80-ddda66cbb007"
                        },
                        {
                            "given": [
                                32
                            ],
                            "label": "Warhammer",
                            "list": [
                                "weapon"
                            ],
                            "multiple": true,
                            "path": "equipment",
                            "type": "list",
                            "uuid": "96c5c2f4-f7d1-45a1-b881-18f52c1cce0b"
                        }
                    ],
                    "type": "choice",
                    "uuid": "bc0755c0-a65e-4a86-9496-9d3373955b0b"
                },
                {
                    "description": "(a) scale mail, (b) leather armor, or (c) chain mail\n(if proficient)",
                    "label": "Armor",
                    "options": [
                        {
                            "given": [
                                44
                            ],
                            "label": "Scale Mail",
                            "list": [
                                "armor"
                            ],
                            "multiple": true,
                            "path": "equipment",
                            "type": "list",
                            "uuid": "2c51e24f-8196-4099-a43a-da7d13b939de"
                        },
                        {
                            "given": [
                                40
                            ],
                            "label": "Leather Armor",
                            "list": [
                                "armor"
                            ],
                            "multiple": true,
                            "path": "equipment",
                            "type": "list",
                            "uuid": "b94e91c4-033a-40a3-a2ff-3bf6297bc321"
                        },
                        {
                            "description": "if proficient",
                            "given": [
                                48
                            ],
                            "label": "Chain Mail",
                            "list": [
                                "armor"
                            ],
                            "multiple": true,
                            "path": "equipment",
                            "type": "list",
                            "uuid": "44951c86-11a4-4406-879b-8fa57cf3cec9"
                        }
                    ],
                    "type": "choice",
                    "uuid": "72e44ca2-225e-4a19-ae8e-779647b11142"
                },
                {
                    "description": "(a) a light crossbow and 20 bolts or (b) any\nsimple weapon",
                    "label": "Weapons",
                    "options": [
                        {
                            "description": "and 20 bolts",
                            "given": [
                                12,
                                "20 x Bolts"
                            ],
                            "label": "Light Crossbow",
                            "list": [
                                "weapon"
                            ],
                            "multiple": true,
                            "path": "equipment",
                            "type": "list",
                            "uuid": "a5c1569a-06d2-4ffd-b1c3-13e3a3490c2a"
                        },
                        {
                            "add": 1,
                            "filter": {
                                "type": [
                                    "simple melee",
                                    "simple ranged"
                                ]
                            },
                            "given": [],
                            "label": "Any simple weapon",
                            "list": [
                                "weapon"
                            ],
                            "multiple": true,
                            "path": "equipment",
                            "type": "list",
                            "uuid": "bce727d4-dc4e-4d4c-a44f-1e3b1826686a"
                        }
                    ],
                    "type": "choice",
                    "uuid": "b2d1e53e-41f8-4a05-8fc3-6489c1760957"
                },
                {
                    "add": 1,
                    "description": "(a) a priest\u2019s pack or (b) an explorer\u2019s pack",
                    "filter": {
                        "label": [
                            "Priest\u2019s Pack",
                            "Explorer\u2019s Pack"
                        ]
                    },
                    "include": 1,
                    "label": "Equipment Packs",
                    "type": "choice",
                    "uuid": "057523f6-4fa2-427d-a886-ab3ea53ea0b2"
                },
                {
                    "given": [
                        "Holy symbol",
                        51
                    ],
                    "label": "A shield and a holy symbol",
                    "list": [
                        "armor"
                    ],
                    "multiple": true,
                    "path": "equipment",
                    "type": "list",
                    "uuid": "ee4982eb-95a0-4eaf-834e-45a7ae8841e2"
                }
            ],
            "description": "You start with the following equipment, in addition to the\nequipment granted by your background:",
            "label": "Equipment",
            "type": "config",
            "uuid": "69a876c4-db04-423b-b7c3-bc0371f7bf0f"
        },
        {
            "config": [
                {
                    "description": "At 1st level, you know three cantrips of your choice from\nthe cleric spell list. You learn additional cleric cantrips\nof your choice at higher levels, as shown in the Cantrips\nKnown column of the Cleric table",
                    "filter": {
                        "classes": [
                            "Cleric"
                        ],
                        "level": [
                            "Cantrip"
                        ]
                    },
                    "label": "Cantrips",
                    "limit_formula": "spell.max_cantrips",
                    "list": [
                        "spell"
                    ],
                    "path": "spell.cantrips",
                    "type": "list",
                    "uuid": "94b03378-f4b9-47a0-9d7c-5b8f0d9d60a6"
                },
                {
                    "label": "Preparing Spells",
                    "path": "info.Preparing Spells",
                    "type": "value",
                    "uuid": "0d65d204-9a75-4e62-82fe-e4d58af040ad",
                    "value": "You prepare the list of cleric spells that are available for\nyou to cast, choosing from the cleric spell list. When you\ndo so, choose a number of cleric spells equal to your \n**Wisdom modifier**+ your cleric level (minimum of one spell).\nThe spells must be of a level for which you have spell slots.\n\nYou can change your list of prepared spells when you\nfinish a long rest. Preparing a new list of cleric spells\nrequires time spent in prayer and meditation: at least 1\nminute per spell level for each spell on your list."
                },
                {
                    "label": "Casting Spells",
                    "path": "info.Casting Spells",
                    "type": "value",
                    "uuid": "0ca2ffff-ec2b-4cb3-8c26-3ed729a7816b",
                    "value": "The Cleric table shows how many spell slots you have to\ncast your cleric spells of 1st level and higher. To cast one\nof these spells, you must expend a slot of the spell\u2019s level\nor higher. You regain all expended spell slots when you\nfinish a long rest."
                },
                {
                    "config": [
                        {
                            "hidden": true,
                            "path": "spell.stat",
                            "type": "value",
                            "uuid": "a757d136-5a41-4662-915b-1363e997d3ef",
                            "value": "wisdom"
                        },
                        {
                            "config": [
                                {
                                    "hidden": true,
                                    "path": "computed.spellSafe_dc.formula",
                                    "type": "value",
                                    "uuid": "b273893b-3937-4329-9ea4-6c1f64885a6f",
                                    "value": "8 + character.proficiency + statistics.modifiers.wisdom"
                                },
                                {
                                    "config": [
                                        {
                                            "hidden": true,
                                            "path": "computed.spellAttack_modifier.formula",
                                            "type": "value",
                                            "uuid": "0ead6985-9c16-49f1-8dbc-574b979c419f",
                                            "value": "character.proficiency + statistics.modifiers.wisdom"
                                        }
                                    ],
                                    "description": "Your **proficiency bonus** + your **Charisma modifier**",
                                    "label": "Spell attack modifier",
                                    "type": "config",
                                    "uuid": "8529eb05-e28c-4ec9-a579-242226726ef1"
                                }
                            ],
                            "description": "`8` + your **Proficiency bonus** + your **Charisma modifier**",
                            "label": "Spell save DC",
                            "type": "config",
                            "uuid": "49225e3f-7150-448f-ba68-95cc10fd3f1d"
                        },
                        {
                            "label": "Ritual Casting",
                            "path": "info.Ritual Casting",
                            "type": "value",
                            "uuid": "ac6b10ae-ed8d-43b9-a781-fde1b5747efd",
                            "value": "You can cast a cleric spell as a ritual if that spell has the\nritual tag and you have the spell prepared."
                        },
                        {
                            "label": "Spellcasting Focus",
                            "path": "info.Spellcasting Focus",
                            "type": "value",
                            "uuid": "bebbcc43-f365-49ab-97fa-b12ff9061cd3",
                            "value": "You can use a holy symbol (found in chapter 5) as a spellcasting focus for your cleric spells."
                        }
                    ],
                    "description": "**Wisdom** is your spellcasting ability for your cleric spells.\nThe power of your spells comes from your devotion to\nyour deity. You use your **Wisdom** whenever a cleric spell\nrefers to your spellcasting ability. In addition, you use\nyour Wisdom modifier when setting the saving throw\nDC for a cleric spell you cast and when making an attack\nroll with one.",
                    "label": "Spellcasting Ability",
                    "type": "config",
                    "uuid": "fcf16773-b026-4338-95ab-d07f8d001300"
                }
            ],
            "description": "As a conduit for divine power, you can cast cleric spells.\nSee chapter 10 for the general rules of spellcasting and\nchapter 11 for a selection of cleric spells.",
            "label": "Spellcasting",
            "type": "config",
            "uuid": "3729e21a-69b9-4558-bbf3-caa27a18001d"
        }
    ],
    "description": "Arms and eyes upraised toward the sun and a prayer\non his lips, an elf begins to glow with an inner light that\nspills out to heal his battle-worn companions.\n\nChanting a song of glory, a dwarf swings his axe in\nwide swaths to cut through the ranks of orcs arrayed\nagainst him, shouting praise to the gods with every\nfoe\u2019s fall.\n\nCalling down a curse upon the forces of undeath, a\nhuman lifts her holy symbol as light pours from it to drive\nback the zombies crowding in on her companions.\n\nClerics are intermediaries between the mortal world\nand the distant planes of the gods. As varied as the gods\nthey serve, clerics strive to embody the handiwork of\ntheir deities. No ordinary priest, a cleric is imbued with\ndivine magic.\n\n## Healers and Warriors\nDivine magic, as the name suggests, is the power of the\ngods, flowing from them into the world. Clerics are conduits for that power, manifesting it as miraculous effects.\nThe gods don\u2019t grant this power to everyone who seeks it,\nbut only to those chosen to fulfill a high calling.\n\nHarnessing divine magic doesn\u2019t rely on study or training. A cleric might learn formulaic prayers and ancient\nrites, but the ability to cast cleric spells relies on devotion\nand an intuitive sense of a deity\u2019s wishes.\n\nClerics combine the helpful magic of healing and inspiring their allies with spells that harm and hinder foes.\nThey can provoke awe and dread, lay curses of plague\nor poison, and even call down flames from heaven to consume their enemies. For those evildoers who will benefit\nmost from a mace to the head, clerics depend on their\ncombat training to let them wade into melee with the\npower of the gods on their side.\n\n## Divine Agents\nNot every acolyte or officiant at a temple or shrine is a\ncleric. Some priests are called to a simple life of temple\nservice, carrying out their gods\u2019 will through prayer and \nsacrifice, not by magic and strength of arms. In some cities, priesthood amounts to a political office, viewed as a\nstepping stone to higher positions of authority and involving no communion with a god at all. True clerics are rare\nin most hierarchies.\n\nWhen a cleric takes up an adventuring life, it is usually\nbecause his or her god demands it. Pursuing the goals\nof the gods often involves braving dangers beyond the\nwalls of civilization, smiting evil or seeking holy relics in\nancient tombs. Many clerics are also expected to protect\ntheir deities\u2019 worshipers, which can mean fighting rampaging orcs, negotiating peace between warring nations,\nor sealing a portal that would allow a demon prince to\nenter the world.\n\nMost adventuring clerics maintain some connection to\nestablished temples and orders of their faiths. A temple\nmight ask for a cleric\u2019s aid, or a high priest might be in a\nposition to demand it.",
    "features": {
        "max_cantrips": [ 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ],
        "max_prepared_formula": "max(1, character.level + statistics.modifiers.wisdom)",
        "slots": [
            [ 2 ],
            [ 3 ],
            [ 4, 2 ],
            [ 4, 3 ],
            [ 4, 3, 2 ],
            [ 4, 3, 3 ],
            [ 4, 3, 3, 1 ],
            [ 4, 3, 3, 2 ],
            [ 4, 3, 3, 3, 1 ],
            [ 4, 3, 3, 3, 2 ],
            [ 4, 3, 3, 3, 2, 1 ],
            [ 4, 3, 3, 3, 2, 1 ],
            [ 4, 3, 3, 3, 2, 1, 1 ],
            [ 4, 3, 3, 3, 2, 1, 1 ],
            [ 4, 3, 3, 3, 2, 1, 1, 1 ],
            [ 4, 3, 3, 3, 2, 1, 1, 1 ],
            [ 4, 3, 3, 3, 2, 1, 1, 1, 1 ],
            [ 4, 3, 3, 3, 3, 1, 1, 1, 1 ],
            [ 4, 3, 3, 3, 3, 2, 1, 1, 1 ],
            [ 4, 3, 3, 3, 3, 2, 2, 1, 1 ]
        ]
    },
    "type": "config"
}');

INSERT INTO `options` (id, name, config)
    VALUES (1, 'Equipment Packs', '{
    "description": "The starting equipment you get from your class includes\na collection of useful adventuring gear, put together in a\npack. The contents of these packs are listed here. If you are\nbuying your starting equipment, you can purchase a pack\nfor the price shown, which might be cheaper than buying\nthe items individually.",
    "options": [
        {
            "description": "**(16 gp)**  Includes a backpack, a bag of\n1,000 ball bearings, 10 feet of string, a bell, 5 candles, a\ncrowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of\noil, 5 days rations, a tinderbox, and a waterskin. The pack\nalso has 50 feet of hempen rope strapped to the side of it.",
            "given": [
                "Backpack",
                "Bag of 1,000 ball bearings",
                "10 Feet of string",
                "Bell",
                "5 x Candle",
                "Crowbar",
                "Hammer",
                "10 x Piton",
                "Hooded lantern",
                "2 x Flask of oil",
                "5 x Day of rations",
                "Tinderbox",
                "Waterskin",
                "50 Feet of hempen rope"
            ],
            "label": "Burglar\u2019s Pack",
            "list": [],
            "multiple": true,
            "path": "equipment",
            "type": "list",
            "uuid": "5e96d2c9-0bbf-4b3f-b5b6-140785f8c535"
        },
        {
            "description": "**(39 gp)** Includes a chest, 2 cases for\nmaps and scrolls, a set of fine clothes, a bottle of ink, an\nink pen, a lamp, 2 flasks of oil, 5 sheets of paper, a vial of\nperfume, sealing wax, and soap.",
            "given": [
                "Chest",
                "2 x Case for maps and scrolls",
                "Set of fine clothes",
                "Bottle of ink",
                "Lamp",
                "2 x Flask of oil",
                "5 x Sheet of paper",
                "Vial of perfume",
                "Sealing was",
                "Soap"
            ],
            "label": "Diplomat\u2019s Pack",
            "multiple": true,
            "path": "equipment",
            "type": "list",
            "uuid": "1f788e04-7367-4fde-917f-b1040d363ae2"
        },
        {
            "description": "**(12 gp)** Includes a backpack, a\ncrowbar, a hammer, 10 pitons, 10 torches, a tinderbox, 10\ndays of rations, and a waterskin. The pack also has 50 feet\nof hempen rope strapped to the side of it.",
            "given": [
                "Backpack",
                "Crowbar",
                "Hammer",
                "10 x Piton",
                "10 x Torch",
                "Tinderbox",
                "10 x Day of rations",
                "Waterskin",
                "50 Feet of hempen rope"
            ],
            "label": "Dungeoneer\u2019s Pack",
            "multiple": true,
            "path": "equipment",
            "type": "list",
            "uuid": "9866ea12-0bb0-4257-9455-e532ba3f5764"
        },
        {
            "description": "**(40 gp)** Includes a backpack, a bedroll,\n2 costumes, 5 candles, 5 days of rations, a waterskin, and a\ndisguise kit.",
            "given": [
                "Backpack",
                "2 x Costume",
                "5 x Candle",
                "5 x Day of rations",
                "Waterskin",
                "Disguise kit"
            ],
            "label": "Entertainer\u2019s Pack",
            "multiple": true,
            "path": "equipment",
            "type": "list",
            "uuid": "fac0ec52-a25f-4aec-b6fc-6f0e00166e0a"
        },
        {
            "description": "**(10 gp)** Includes a backpack, a bedroll,\na mess kit, a tinderbox, 10 torches, 10 days of rations, and\na waterskin. The pack also has 50 feet of hempen rope\nstrapped to the side of it",
            "given": [
                "Backpack",
                "Bedroll",
                "Mess kit",
                "Tinderbox",
                "10 x Torch",
                "10 x Day of rations",
                "Waterskin",
                "50 Feet of hempen rope"
            ],
            "label": "Explorer\u2019s Pack",
            "multiple": true,
            "path": "equipment",
            "type": "list",
            "uuid": "28d04479-11f4-4b23-aad7-ee92ec818ddd"
        },
        {
            "description": "**(19 gp)** Includes a backpack, a blanket, 10\ncandles, a tinderbox, an alms box, 2 blocks of incense, a\ncenser, vestments, 2 days of rations, and a waterskin.",
            "given": [
                "Backpack",
                "Blanket",
                "10 x Candle",
                "Tinderbox",
                "Alms box",
                "2 x Block of incense",
                "Censer",
                "Vestments",
                "2 x Day of rations",
                "Waterskin"
            ],
            "label": "Priest\u2019s Pack",
            "multiple": true,
            "path": "equipment",
            "type": "list",
            "uuid": "2b9d026d-d989-46e7-8434-b3dbd6a1f4c7"
        },
        {
            "description": "**(40 gp)** Includes a backpack, a book of\nlore, a bottle of ink, an ink pen, 10 sheets of parchment, a\nlittle bag of sand, and a small knife.",
            "given": [
                "Backpack",
                "Book of lore",
                "Bottle of ink",
                "Ink pen",
                "10 x Sheet of parchment",
                "Little bag of sand",
                "Small knife"
            ],
            "label": "Scholar\u2019s Pack",
            "multiple": true,
            "path": "equipment",
            "type": "list",
            "uuid": "2199848e-b3e3-40c8-9f8a-af3fdac5911c"
        }
    ],
    "type": "choice"
}');
COMMIT;
