const armor_types = [
    {"code": "light", "label": "Light Armor"},
    {"code": "medium", "label": "Medium Armor"},
    {"code": "heavy", "label": "Heavy Armor"},
    {"code": "shield", "label": "Shields"}
];

const attack_modes = [
    {"code": "melee", "label": "Melee Attack", "short": "M", "description": "Melee weapon attack."},
    {"code": "ranged", "label": "Ranged Attack", "short": "R", "description": "Ranged weapon attack."},
    {"code": "spell", "label": "Spell Attack", "short": "S", "description": "Spell attack."}
];

const alignments = [
    {
        code: "lawful good",
        label: "Lawful good"
    },
    {
        code: "neutral good",
        label: "Neutral good"
    },
    {
        code: "chaotic good",
        label: "Chaotic good"
    },
    {
        code: "lawful neutral",
        label: "Lawful neutral"
    },
    {
        code: "true neutral",
        label: "True neutral"
    },
    {
        code: "chaotic neutral",
        label: "Chaotic neutral"
    },
    {
        code: "lawful evil",
        label: "Lawful evil"
    },
    {
        code: "neutral evil",
        label: "Neutral evil"
    },
    {
        code: "chaotic evil",
        label: "Chaotic evil"
    }
];

const classes = [
    {"code": "Barbarian", "label": "Barbarian", "description": "A fierce warrior of primitive background who can enter a battle rage."},
    {"code": "Bard", "label": "Bard", "description": "An inspiring magician whose power echoes the music of creation."},
    {"code": "Cleric", "label": "Cleric", "description": "A priestly champion who wields divine magic in service of a higher power."},
    {"code": "Druid", "label": "Druid", "description": "A priest of the Old Faith, wielding the powers of nature — moonlight and plant growth, fire and lightning — and adopting animal forms."},
    {"code": "Fighter", "label": "Fighter", "description": "A master of martial combat, skilled wita variety of weapons and armor."},
    {"code": "Monk", "label": "Monk", "description": "An master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection."},
    {"code": "Paladin", "label": "Paladin", "description": "A holy warrior bound to a sacred oath."},
    {"code": "Ranger", "label": "Ranger", "description": "A warrior who uses martial prowess annature magic to combat threats on the edges of civilization."},
    {"code": "Rogue", "label": "Rogue", "description": "A scoundrel who uses stealth and trickery to overcome obstacles and enemies."},
    {"code": "Sorcerer", "label": "Sorcerer", "description": "A spellcaster who draws on inherent magic from a gift or bloodline."},
    {"code": "Warlock", "label": "Warlock", "description": "A wielder of magic that is derived from a bargain with an extraplanar entity."},
    {"code": "Wizard", "label": "Wizard", "description": "A scholarly magic-user capable of manipulating the structures of reality."}
];

const damage_types = [
    {
        code: "acid",
        label: "Acid",
        short: "Acd",
        description: "Corrosive spray"
    }, {
        code: "bludgeoning",
        label: "Bludgeoning",
        short: "Bldg",
        description: "Blunt force"
    }, {
        code: "cold",
        label: "Cold",
        short: "Cld",
        description: "The infernal chill"
    }, {
        code: "fire",
        label: "Fire",
        short: "Fr",
        description: "Red dragons breathe fire"
    }, {
        code: "force",
        label: "Force",
        short: "Frc",
        description: "Force is pure magical"
    }, {
        code: "lightning",
        label: "Lightning",
        short: "Ltn",
        description: "A lightning bolt"
    }, {
        code: "necrotic",
        label: "Necrotic",
        short: "Ncr",
        description: "Necrotic damage"
    }, {
        code: "piercing",
        label: "Piercing",
        short: "Pcn",
        description: "Puncturing"
    }, {
        code: "poison",
        label: "Poison",
        short: "Psn",
        description: "Venomous stings"
    }, {
        code: "psychic",
        label: "Psychic",
        short: "Psy",
        description: "Mental abilities"
    }, {
        code: "radiant",
        label: "Radiant",
        short: "Rdnt",
        description: "Radiant damage"
    }, {
        code: "slashing",
        label: "Slashing",
        short: "Slsh",
        description: "Swords"
    }, {
        code: "thunder",
        label: "Thunder",
        short: "Tndr",
        description: "Burst of sound"
    }
];

const genders = [
    {
        code: "genderless",
        label: "Genderless"
    },
    {
        code: "male",
        label: "Male"
    },
    {
        code: "female",
        label: "Female"
    }
];

const languages = [{
        code: "common",
        label: "Common",
        speakers: "Humans",
        script: "Common",
        type: "common"
    },
    {
        code: "dwarvish",
        label: "Dwarvish",
        speakers: "Dwarves",
        script: "Dwarvish",
        type: "common"
    },
    {
        code: "draconic",
        label: "Draconic",
        speakers: "Dragons, Dragonborn",
        script: "Draconic",
        type: "exotic"
    },
];
const magic_components = [{
        code: "verbal",
        label: "Verbal",
        short: "V",
        description: "Spoken"
    },
    {
        code: "somatic",
        label: "Somatic",
        short: "S",
        description: "Gestured"
    },
    {
        code: "material",
        label: "Material",
        short: "M",
        description: "Stuff"
    }
];

const magic_schools = [{
        code: "abjuration",
        label: "Abjuration",
        description: "Magic that blocks"
    },
    {
        code: "conjuration",
        label: "Conjuration",
        description: "Produce objects"
    },
    {
        code: "divination",
        label: "Divination",
        description: "Spells of discernment"
    },
    {
        code: "enchantment",
        label: "Enchantment",
        description: "<agically entrance and beguile"
    },
    {
        code: "evocation",
        label: "Evocation",
        description: "Creates powerful elemental effects"
    },
    {
        code: "illusion",
        label: "Illusion",
        description: "Dazzles the senses"
    },
    {
        code: "necromancy",
        label: "Necromancy",
        description: "Cosmic forces of death"
    },
    {
        code: "transmutation",
        label: "Transmutation",
        description: "Modify energy and matter"
    }
];

const monster_types = [
    {
        code: "Aberration",
        label: "Aberration",
        description: "Aberration",
        intelligent: false
    }, {
        code: "Beast",
        label: "Beast",
        description: "Beast",
        intelligent: false
    }, {
        code: "Celestial",
        label: "Celestial",
        description: "Celestial",
        intelligent: true
    }, {
        code: "Construct",
        label: "Construct",
        description: "Construct",
        intelligent: false
    }, {
        code: "Dragon",
        label: "Dragon",
        description: "Dragon",
        intelligent: true
    }, {
        code: "Elemental",
        label: "Elemental",
        description: "Elemental",
        intelligent: false
    }, {
        code: "Fey",
        label: "Fey",
        description: "Fey",
        intelligent: true
    }, {
        code: "Fiend",
        label: "Fiend",
        description: "Fiend",
        intelligent: false
    }, {
        code: "Giant",
        label: "Giant",
        description: "Giant",
        intelligent: true
    }, {
        code: "Humanoid",
        label: "Humanoid",
        description: "Humanoid",
        intelligent: true
    }, {
        code: "Monstrosity",
        label: "Monstrosity",
        description: "Monstrosity",
        intelligent: false
    }, {
        code: "Ooze",
        label: "Ooze",
        description: "Ooze",
        intelligent: false
    }, {
        code: "Plant",
        label: "Plant",
        description: "Plant",
        intelligent: false
    }, {
        code: "Undead",
        label: "Undead",
        description: "Undead",
        intelligent: false
    }
];

const size_hit_dice = [
    {
        code: "tiny",
        dice_size: 4,
        label: "Tiny"
    },
    {
        code: "small",
        dice_size: 6,
        label: "Small"
    },
    {
        code: "medium",
        dice_size: 8,
        label: "Medium"
    },
    {
        code: "large",
        dice_size: 10,
        label: "Large"
    },
    {
        code: "huge",
        dice_size: 12,
        label: "Huge"
    },
    {
        code: "gargantuan",
        dice_size: 20,
        label: "Gargantuan"
    }
];

const skills = [
    {code: "athletics", label: "Athletics", stat: "strength"},
    {code: "acrobatics", label: "Acrobatics", stat: "dexterity"},
    {code: "sleight of hand", label: "Sleight of Hand", stat: "dexterity"},
    {code: "stealth", label: "Stealth", stat: "dexterity"},
    {code: "arcana", label: "Arcana", stat: "intelligence"},
    {code: "history", label: "History", stat: "intelligence"},
    {code: "investigation", label: "Investigation", stat: "intelligence"},
    {code: "nature", label: "Nature", stat: "intelligence"},
    {code: "religion", label: "Religion", stat: "intelligence"},
    {code: "animal handling", label: "Animal Handling", stat: "wisdom"},
    {code: "insight", label: "Insight", stat: "wisdom"},
    {code: "medicine", label: "Medicine", stat: "wisdom"},
    {code: "perception", label: "Perception", stat: "wisdom"},
    {code: "survival", label: "Survival", stat: "wisdom"},
    {code: "deception", label: "Deception", stat: "charisma"},
    {code: "intimidation", label: "Intimidation", stat: "charisma"},
    {code: "performance", label: "Performance", stat: "charisma"},
    {code: "persuasion", label: "Persuasion", stat: "charisma"}
];

const statistics = [
    {
        description: "Str",
        label: "Strength",
        code: "strength"
    }, {
        description: "Dex",
        label: "Dexterity",
        code: "dexterity"
    }, {
        description: "Con",
        label: "Constitution",
        code: "constitution"
    }, {
        description: "Int",
        label: "Intelligence",
        code: "intelligence"
    }, {
        description: "Wis",
        label: "Wisdom",
        code: "wisdom"
    }, {
        description: "Char",
        label: "Charisma",
        code: "charisma"
    }
];

const target_methods = [
    {"code": "single", "label": "Single target", "short": "ST", "description": "One target is affected."},
    {"code": "multiple", "label": "Multi-target", "short": "MT", "description": "Multiple targets are affected. Usually when clustered together."},
    {"code": "area", "label": "Area of Effect", "short": "AoE", "description": "An area of a specific size and shape is affected. Every designated target inside is affected."}
];

const user_roles = [{
        "code": "admin",
        "label": "Site Administrator"
    },
    {
        "code": "dm",
        "label": "Dungeon Master"
    },
    {
        "code": "player",
        "label": "Player"
    }
];
const weapon_properties = [{
        "code": "ammunition",
        "label": "Ammunition",
        "short": "Ammo",
        "description": "You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack. At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield. If you use a weapon that has the ammunition property to make a melee attack, you treat the weapon as an improvised weapon. A sling must be loaded to deal any damage when used in this way."
    },
    {
        "code": "finesse",
        "label": "Finesse",
        "short": "Fns",
        "description": "When making an attack with a finesse weapon, you use your choice of your **Strength** or **Dexterity** modifier for the attack and damage rolls. You must use the same modifier for both rolls."
    },
    {
        "code": "heavy",
        "label": "Heavy",
        "short": "Heav",
        "description": "Small creatures have **Disadvantage** on attack rolls with heavy weapons. A heavy weapon's size and bulk make it too large for a Small creature to use effectively."
    },
    {
        "code": "light",
        "label": "Light",
        "short": "Lite",
        "description": "A light weapon is small and easy to handle. making it ideal for use when fighting with two weapons."
    },
    {
        "code": "loading",
        "label": "Loading",
        "short": "Ldng",
        "description": "Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction to fire it, regardless of the number of attacks you can normally make."
    },
    {
        "code": "reach",
        "label": "Reach",
        "short": "Rch",
        "description": "This weapon adds 5 feet to your reach when you attack with it."
    },
    {
        "code": "ranged",
        "label": "Ranged",
        "short": "Rngd",
        "hidden": true,
        "description": "A weapon that can be used to make a ranged attack has a range shown in parentheses after the Ammunition or Thrown property. The range lists two numbers. The first is the weapon's normal range in feet, and the second indicates the weapon's maximum range. When attacking a target beyond normal range you have **Disadvantage** on the attack roll. You can't attack a target beyond the weapon's long range."
    },
    {
        "code": "special",
        "label": "Special",
        "short": "Spcl",
        "description": "A weapon with the special property has unusual rules governing its use, explained in the weapon's description."
    },
    {
        "code": "thrown",
        "label": "Thrown",
        "short": "Trwn",
        "description": "If a weapon has the thrown property, you can throw the weapon to make a ranged attack. If the weapon is a melee weapon, you use the same ability modifier for that attack roll and damage roll that you would use for a melee attack with the weapon. For example, if you throw a handaxe, you use your **Strength**, but if you throw a dagger, you can use either your **Strength** or your **Dexterity**, since the dagger has the **Finesse** property."
    },
    {
        "code": "two-handed",
        "label": "Two-Handed",
        "short": "2H",
        "description": "This weapon requires two hands to use."
    },
    {
        "code": "versatile",
        "label": "Versatile",
        "short": "Vstl",
        "description": "This weapon can be used with one or two hands. A damage value in parentheses appears with the property - the damage when the weapon is used with two hands to make a melee attack."
    }
];

const weapon_types = [{
        "code": "simple melee",
        "label": "Simple Melee Weapon",
        "short": "Melee"
    },
    {
        "code": "simple ranged",
        "label": "Simple Ranged Weapon",
        "short": "Ranged"
    },
    {
        "code": "martial melee",
        "label": "Martial Melee Weapon",
        "short": "Melee"
    },
    {
        "code": "martial ranged",
        "label": "Martial Ranged Weapon",
        "short": "Ranged"
    }
]

export {
    armor_types,
    attack_modes,
    alignments,
    classes,
    damage_types,
    genders,
    languages,
    magic_components,
    magic_schools,
    monster_types,
    size_hit_dice,
    skills,
    statistics,
    target_methods,
    user_roles,
    weapon_properties,
    weapon_types,
};
