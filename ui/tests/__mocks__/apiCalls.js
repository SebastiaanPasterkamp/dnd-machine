const armor_types = [
    {id: "light", name: "Light Armor", type: "armor_types"},
    {id: "medium", name: "Medium Armor", type: "armor_types"},
    {id: "heavy", name: "Heavy Armor", type: "armor_types"},
    {id: "shield", name: "Shields", type: "armor_types"}
];

const attack_modes = [
    {id: "melee", name: "Melee Attack", short: "M", description: "Melee weapon attack.", type: "attack_modes"},
    {id: "ranged", name: "Ranged Attack", short: "R", description: "Ranged weapon attack.", type: "attack_modes"},
    {id: "spell", name: "Spell Attack", short: "S", description: "Spell attack.", type: "attack_modes"}
];

const alignments = [
    { id: "lawful good", name: "Lawful good", type: "alignments" },
    { id: "neutral good", name: "Neutral good", type: "alignments" },
    { id: "chaotic good", name: "Chaotic good", type: "alignments" },
    { id: "lawful neutral", name: "Lawful neutral", type: "alignments" },
    { id: "true neutral", name: "True neutral", type: "alignments" },
    { id: "chaotic neutral", name: "Chaotic neutral", type: "alignments" },
    { id: "lawful evil", name: "Lawful evil", type: "alignments" },
    { id: "neutral evil", name: "Neutral evil", type: "alignments" },
    { id: "chaotic evil", name: "Chaotic evil", type: "alignments" }
];

const damage_types = [
    {
        id: "acid",
        name: "Acid",
        short: "Acd",
        description: "Corrosive spray",
        type: "damage_types",
    }, {
        id: "bludgeoning",
        name: "Bludgeoning",
        short: "Bldg",
        description: "Blunt force",
        type: "damage_types",
    }, {
        id: "cold",
        name: "Cold",
        short: "Cld",
        description: "The infernal chill",
        type: "damage_types",
    }, {
        id: "fire",
        name: "Fire",
        short: "Fr",
        description: "Red dragons breathe fire",
        type: "damage_types",
    }, {
        id: "force",
        name: "Force",
        short: "Frc",
        description: "Force is pure magical",
        type: "damage_types",
    }, {
        id: "lightning",
        name: "Lightning",
        short: "Ltn",
        description: "A lightning bolt",
        type: "damage_types",
    }, {
        id: "necrotic",
        name: "Necrotic",
        short: "Ncr",
        description: "Necrotic damage",
        type: "damage_types",
    }, {
        id: "piercing",
        name: "Piercing",
        short: "Pcn",
        description: "Puncturing",
        type: "damage_types",
    }, {
        id: "poison",
        name: "Poison",
        short: "Psn",
        description: "Venomous stings",
        type: "damage_types",
    }, {
        id: "psychic",
        name: "Psychic",
        short: "Psy",
        description: "Mental abilities",
        type: "damage_types",
    }, {
        id: "radiant",
        name: "Radiant",
        short: "Rdnt",
        description: "Radiant damage",
        type: "damage_types",
    }, {
        id: "slashing",
        name: "Slashing",
        short: "Slsh",
        description: "Swords",
        type: "damage_types",
    }, {
        id: "thunder",
        name: "Thunder",
        short: "Tndr",
        description: "Burst of sound",
        type: "damage_types",
    }
];

const genders = [
    { id: "genderless", name: "Genderless", type: "genders" },
    { id: "male", name: "Male", type: "genders" },
    { id: "female", name: "Female", type: "genders" }
];

const languages = [{
        id: "common",
        name: "Common",
        speakers: "Humans",
        script: "Common",
        group: "common",
        type: "languages",
    },
    {
        id: "dwarvish",
        name: "Dwarvish",
        speakers: "Dwarves",
        script: "Dwarvish",
        group: "common",
        type: "languages",
    },
    {
        id: "draconic",
        name: "Draconic",
        speakers: "Dragons, Dragonborn",
        script: "Draconic",
        group: "exotic",
        type: "languages",
    },
];
const magic_components = [{
        id: "verbal",
        name: "Verbal",
        short: "V",
        description: "Spoken",
        type: "magic_components",
    },
    {
        id: "somatic",
        name: "Somatic",
        short: "S",
        description: "Gestured",
        type: "magic_components",
    },
    {
        id: "material",
        name: "Material",
        short: "M",
        description: "Stuff",
        type: "magic_components",
    }
];

const magic_schools = [{
        id: "abjuration",
        name: "Abjuration",
        description: "Magic that blocks",
        type: "magic_schools",
    },
    {
        id: "conjuration",
        name: "Conjuration",
        description: "Produce objects",
        type: "magic_schools",
    },
    {
        id: "divination",
        name: "Divination",
        description: "Spells of discernment",
        type: "magic_schools",
    },
    {
        id: "enchantment",
        name: "Enchantment",
        description: "<agically entrance and beguile",
        type: "magic_schools",
    },
    {
        id: "evocation",
        name: "Evocation",
        description: "Creates powerful elemental effects",
        type: "magic_schools",
    },
    {
        id: "illusion",
        name: "Illusion",
        description: "Dazzles the senses",
        type: "magic_schools",
    },
    {
        id: "necromancy",
        name: "Necromancy",
        description: "Cosmic forces of death",
        type: "magic_schools",
    },
    {
        id: "transmutation",
        name: "Transmutation",
        description: "Modify energy and matter",
        type: "magic_schools",
    }
];

const monster_types = [
    {
        id: "Aberration",
        name: "Aberration",
        description: "Aberration",
        intelligent: false,
        type: "monster_types",
    }, {
        id: "Beast",
        name: "Beast",
        description: "Beast",
        intelligent: false,
        type: "monster_types",
    }, {
        id: "Celestial",
        name: "Celestial",
        description: "Celestial",
        intelligent: true,
        type: "monster_types",
    }, {
        id: "Construct",
        name: "Construct",
        description: "Construct",
        intelligent: false,
        type: "monster_types",
    }, {
        id: "Dragon",
        name: "Dragon",
        description: "Dragon",
        intelligent: true,
        type: "monster_types",
    }, {
        id: "Elemental",
        name: "Elemental",
        description: "Elemental",
        intelligent: false,
        type: "monster_types",
    }, {
        id: "Fey",
        name: "Fey",
        description: "Fey",
        intelligent: true,
        type: "monster_types",
    }, {
        id: "Fiend",
        name: "Fiend",
        description: "Fiend",
        intelligent: false,
        type: "monster_types",
    }, {
        id: "Giant",
        name: "Giant",
        description: "Giant",
        intelligent: true,
        type: "monster_types",
    }, {
        id: "Humanoid",
        name: "Humanoid",
        description: "Humanoid",
        intelligent: true,
        type: "monster_types",
    }, {
        id: "Monstrosity",
        name: "Monstrosity",
        description: "Monstrosity",
        intelligent: false,
        type: "monster_types",
    }, {
        id: "Ooze",
        name: "Ooze",
        description: "Ooze",
        intelligent: false,
        type: "monster_types",
    }, {
        id: "Plant",
        name: "Plant",
        description: "Plant",
        intelligent: false,
        type: "monster_types",
    }, {
        id: "Undead",
        name: "Undead",
        description: "Undead",
        intelligent: false,
        type: "monster_types",
    }
];

const size_hit_dice = [
    { id: "tiny", dice_size: 4, name: "Tiny", type: "size_hit_dice" },
    { id: "small", dice_size: 6, name: "Small", type: "size_hit_dice" },
    { id: "medium", dice_size: 8, name: "Medium", type: "size_hit_dice" },
    { id: "large", dice_size: 10, name: "Large", type: "size_hit_dice" },
    { id: "huge", dice_size: 12, name: "Huge", type: "size_hit_dice" },
    { id: "gargantuan", dice_size: 20, name: "Gargantuan", type: "size_hit_dice" }
];

const skills = [
    {id: "athletics", name: "Athletics", stat: "strength", type: "skills" },
    {id: "acrobatics", name: "Acrobatics", stat: "dexterity", type: "skills" },
    {id: "sleight of hand", name: "Sleight of Hand", stat: "dexterity"},
    {id: "stealth", name: "Stealth", stat: "dexterity", type: "skills" },
    {id: "arcana", name: "Arcana", stat: "intelligence", type: "skills" },
    {id: "history", name: "History", stat: "intelligence", type: "skills" },
    {id: "investigation", name: "Investigation", stat: "intelligence", type: "skills" },
    {id: "nature", name: "Nature", stat: "intelligence", type: "skills" },
    {id: "religion", name: "Religion", stat: "intelligence", type: "skills" },
    {id: "animal handling", name: "Animal Handling", stat: "wisdom", type: "skills" },
    {id: "insight", name: "Insight", stat: "wisdom", type: "skills" },
    {id: "medicine", name: "Medicine", stat: "wisdom", type: "skills" },
    {id: "perception", name: "Perception", stat: "wisdom", type: "skills" },
    {id: "survival", name: "Survival", stat: "wisdom", type: "skills" },
    {id: "deception", name: "Deception", stat: "charisma", type: "skills" },
    {id: "intimidation", name: "Intimidation", stat: "charisma", type: "skills" },
    {id: "performance", name: "Performance", stat: "charisma", type: "skills" },
    {id: "persuasion", name: "Persuasion", stat: "charisma", type: "skills" }
];

const statistics = [
    { name: "Strength", id: "strength", description: "Str", type: "statistics" },
    { name: "Dexterity", id: "dexterity", description: "Dex", type: "statistics" },
    { name: "Constitution", id: "constitution", description: "Con", type: "statistics" },
    { name: "Intelligence", id: "intelligence", description: "Int", type: "statistics" },
    { name: "Wisdom", id: "wisdom", description: "Wis", type: "statistics" },
    { name: "Charisma", id: "charisma", description: "Char", type: "statistics" }
];

const target_methods = [
    {id: "single", name: "Single target", short: "ST", description: "One target is affected.", type: "target_methods" },
    {id: "multiple", name: "Multi-target", short: "MT", description: "Multiple targets are affected. Usually when clustered together.", type: "target_methods" },
    {id: "area", name: "Area of Effect", short: "AoE", description: "An area of a specific size and shape is affected. Every designated target inside is affected.", type: "target_methods" },
];

const user_roles = [
    { id: "admin", name: "Site Administrator", type: "user_roles" },
    { id: "dm", name: "Dungeon Master", type: "user_roles" },
    { id: "player", name: "Player", type: "user_roles" },
];
const weapon_properties = [{
        id: "ammunition",
        name: "Ammunition",
        short: "Ammo",
        description: "You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack. At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield. If you use a weapon that has the ammunition property to make a melee attack, you treat the weapon as an improvised weapon. A sling must be loaded to deal any damage when used in this way.",
        type: "weapon_properties",
    },
    {
        id: "finesse",
        name: "Finesse",
        short: "Fns",
        description: "When making an attack with a finesse weapon, you use your choice of your **Strength** or **Dexterity** modifier for the attack and damage rolls. You must use the same modifier for both rolls.",
        type: "weapon_properties",
    },
    {
        id: "heavy",
        name: "Heavy",
        short: "Heav",
        description: "Small creatures have **Disadvantage** on attack rolls with heavy weapons. A heavy weapon's size and bulk make it too large for a Small creature to use effectively.",
        type: "weapon_properties",
    },
    {
        id: "light",
        name: "Light",
        short: "Lite",
        description: "A light weapon is small and easy to handle. making it ideal for use when fighting with two weapons.",
        type: "weapon_properties",
    },
    {
        id: "loading",
        name: "Loading",
        short: "Ldng",
        description: "Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction to fire it, regardless of the number of attacks you can normally make.",
        type: "weapon_properties",
    },
    {
        id: "reach",
        name: "Reach",
        short: "Rch",
        description: "This weapon adds 5 feet to your reach when you attack with it.",
        type: "weapon_properties",
    },
    {
        id: "ranged",
        name: "Ranged",
        short: "Rngd",
        hidden: true,
        description: "A weapon that can be used to make a ranged attack has a range shown in parentheses after the Ammunition or Thrown property. The range lists two numbers. The first is the weapon's normal range in feet, and the second indicates the weapon's maximum range. When attacking a target beyond normal range you have **Disadvantage** on the attack roll. You can't attack a target beyond the weapon's long range.",
        type: "weapon_properties",
    },
    {
        id: "special",
        name: "Special",
        short: "Spcl",
        description: "A weapon with the special property has unusual rules governing its use, explained in the weapon's description.",
        type: "weapon_properties",
    },
    {
        id: "thrown",
        name: "Thrown",
        short: "Trwn",
        description: "If a weapon has the thrown property, you can throw the weapon to make a ranged attack. If the weapon is a melee weapon, you use the same ability modifier for that attack roll and damage roll that you would use for a melee attack with the weapon. For example, if you throw a handaxe, you use your **Strength**, but if you throw a dagger, you can use either your **Strength** or your **Dexterity**, since the dagger has the **Finesse** property.",
        type: "weapon_properties",
    },
    {
        id: "two-handed",
        name: "Two-Handed",
        short: "2H",
        description: "This weapon requires two hands to use.",
        type: "weapon_properties",
    },
    {
        id: "versatile",
        name: "Versatile",
        short: "Vstl",
        description: "This weapon can be used with one or two hands. A damage value in parentheses appears with the property - the damage when the weapon is used with two hands to make a melee attack.",
        type: "weapon_properties",
    }
];

const weapon_types = [
    { id: "simple melee", name: "Simple Melee Weapon", short: "Melee", type: "weapon_types" },
    { id: "simple ranged", name: "Simple Ranged Weapon", short: "Ranged", type: "weapon_types" },
    { id: "martial melee", name: "Martial Melee Weapon", short: "Melee", type: "weapon_types" },
    { id: "martial ranged", name: "Martial Ranged Weapon", short: "Ranged", type: "weapon_types" },
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
    user_roles,
    weapon_properties,
    weapon_types,
};
