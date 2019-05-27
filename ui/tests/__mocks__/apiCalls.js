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

export {
    armor_types,
    attack_modes,
    alignments,
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
};
