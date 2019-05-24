const alignments = [
    {
        "code": "lawful good",
        "label": "Lawful good"
    },
    {
        "code": "neutral good",
        "label": "Neutral good"
    },
    {
        "code": "chaotic good",
        "label": "Chaotic good"
    },
    {
        "code": "lawful neutral",
        "label": "Lawful neutral"
    },
    {
        "code": "true neutral",
        "label": "True neutral"
    },
    {
        "code": "chaotic neutral",
        "label": "Chaotic neutral"
    },
    {
        "code": "lawful evil",
        "label": "Lawful evil"
    },
    {
        "code": "neutral evil",
        "label": "Neutral evil"
    },
    {
        "code": "chaotic evil",
        "label": "Chaotic evil"
    }
];

const genders = [
    {
        "code": "genderless",
        "label": "Genderless"
    },
    {
        "code": "male",
        "label": "Male"
    },
    {
        "code": "female",
        "label": "Female"
    }
];

const size_hit_dice = [
    {
        "code": "tiny",
        "dice_size": 4,
        "label": "Tiny"
    },
    {
        "code": "small",
        "dice_size": 6,
        "label": "Small"
    },
    {
        "code": "medium",
        "dice_size": 8,
        "label": "Medium"
    },
    {
        "code": "large",
        "dice_size": 10,
        "label": "Large"
    },
    {
        "code": "huge",
        "dice_size": 12,
        "label": "Huge"
    },
    {
        "code": "gargantuan",
        "dice_size": 20,
        "label": "Gargantuan"
    }
];

const statistics = [
    {
        "description": "Str",
        "label": "Strength",
        "code": "strength"
    }, {
        "description": "Dex",
        "label": "Dexterity",
        "code": "dexterity"
    }, {
        "description": "Con",
        "label": "Constitution",
        "code": "constitution"
    }, {
        "description": "Int",
        "label": "Intelligence",
        "code": "intelligence"
    }, {
        "description": "Wis",
        "label": "Wisdom",
        "code": "wisdom"
    }, {
        "description": "Char",
        "label": "Charisma",
        "code": "charisma"
    }
];

export {
    alignments,
    genders,
    size_hit_dice,
    statistics,
};
