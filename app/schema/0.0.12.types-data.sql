-- Create and populate 'types' table

DROP TABLE IF EXISTS `types`;
CREATE TABLE `types` (
  `id` varchar(32) PRIMARY KEY NOT NULL,
  `type` TEXT NOT NULL,
  `name` TEXT NOT NULL,
  `config` TEXT
);

BEGIN TRANSACTION;
INSERT INTO `types` (id, type, name, config)
     ('admin', 'user_roles', 'Site Administrator', '{}');
 INSERT INTO `types` (id, type, name, config)
      ('dm', 'user_roles', 'Dungeon Master', '{}');
  INSERT INTO `types` (id, type, name, config)
       ('player', 'user_roles', 'Player', '{}');

INSERT INTO `types` (id, type, name, config)
    VALUES ('tiny', 'size_hit_dice', 'Tiny', '{"dice_size": 4}');
INSERT INTO `types` (id, type, name, config)
    VALUES ('small', 'size_hit_dice', 'Small', '{"dice_size": 6}');
INSERT INTO `types` (id, type, name, config)
    VALUES ('medium', 'size_hit_dice', 'Medium', '{"dice_size": 8}');
INSERT INTO `types` (id, type, name, config)
    VALUES ('large', 'size_hit_dice', 'Large', '{"dice_size": 10}');
INSERT INTO `types` (id, type, name, config)
    VALUES ('huge', 'size_hit_dice', 'Huge', '{"dice_size": 12}');
INSERT INTO `types` (id, type, name, config)
    VALUES ('gargantuan', 'size_hit_dice', 'Gargantuan', '{"dice_size": 20}');

INSERT INTO `types` (id, type, name, config)
    VALUES ('ammunition', 'weapon_properties', 'Ammunition', '{"short": "Ammo", "description": "You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack. At the end of the battle, you can recover half your expended ammunition by taking a minute to search the battlefield. If you use a weapon that has the ammunition property to make a melee attack, you treat the weapon as an improvised weapon. A sling must be loaded to deal any damage when used in this way." }');
INSERT INTO `types` (id, type, name, config)
    VALUES ('finesse', 'weapon_properties', 'Finesse', '{"short": "Fns", "description": "When making an attack with a finesse weapon, you use your choice of your **Strength** or **Dexterity** modifier for the attack and damage rolls. You must use the same modifier for both rolls." }');
INSERT INTO `types` (id, type, name, config)
    VALUES ('heavy', 'weapon_properties', 'Heavy', '{"short": "Heav", "description": "Small creatures have **Disadvantage** on attack rolls with heavy weapons. A heavy weapon''s size and bulk make it too large for a Small creature to use effectively." }');
INSERT INTO `types` (id, type, name, config)
    VALUES ('light', 'weapon_properties', 'Light', '{"short": "Lite", "description": "A light weapon is small and easy to handle. making it ideal for use when fighting with two weapons." }');
INSERT INTO `types` (id, type, name, config)
    VALUES ('loading', 'weapon_properties', 'Loading', '{"short": "Ldng", "description": "Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction to fire it, regardless of the number of attacks you can normally make." }');
INSERT INTO `types` (id, type, name, config)
    VALUES ('reach', 'weapon_properties', 'Reach', '{"short": "Rch", "description": "This weapon adds 5 feet to your reach when you attack with it." }');
INSERT INTO `types` (id, type, name, config)
    VALUES ('ranged', 'weapon_properties', 'Ranged', '{"short": "Rngd", "hidden": true, "description": "A weapon that can be used to make a ranged attack has a range shown in parentheses after the Ammunition or Thrown property. The range lists two numbers. The first is the weapon''s normal range in feet, and the second indicates the weapon''s maximum range. When attacking a target beyond normal range you have **Disadvantage** on the attack roll. You can''t attack a target beyond the weapon''s long range." }');
INSERT INTO `types` (id, type, name, config)
    VALUES ('special', 'weapon_properties', 'Special', '{"short": "Spcl", "description": "A weapon with the special property has unusual rules governing its use, explained in the weapon''s description." }');
INSERT INTO `types` (id, type, name, config)
    VALUES ('thrown', 'weapon_properties', 'Thrown', '{"short": "Trwn", "description": "If a weapon has the thrown property, you can throw the weapon to make a ranged attack. If the weapon is a melee weapon, you use the same ability modifier for that attack roll and damage roll that you would use for a melee attack with the weapon. For example, if you throw a handaxe, you use your **Strength**, but if you throw a dagger, you can use either your **Strength** or your **Dexterity**, since the dagger has the **Finesse** property." }');
INSERT INTO `types` (id, type, name, config)
    VALUES ('two-handed', 'weapon_properties', 'Two-Handed', '{"short": "2H", "description": "This weapon requires two hands to use." }');
INSERT INTO `types` (id, type, name, config)
    VALUES ('versatile', 'weapon_properties', 'Versatile', '{"short": "Vstl", "description": "This weapon can be used with one or two hands. A damage value in parentheses appears with the property - the damage when the weapon is used with two hands to make a melee attack." }');

INSERT INTO `types` (id, type, name, config)
     ('unaligned', 'alignments', 'Unaligned', '{}');
INSERT INTO `types` (id, type, name, config)
     ('lawful good', 'alignments', 'Lawful good', '{}');
INSERT INTO `types` (id, type, name, config)
     ('neutral good', 'alignments', 'Neutral good', '{}');
INSERT INTO `types` (id, type, name, config)
     ('chaotic good', 'alignments', 'Chaotic good', '{}');
INSERT INTO `types` (id, type, name, config)
     ('lawful neutral', 'alignments', 'Lawful neutral', '{}');
INSERT INTO `types` (id, type, name, config)
     ('true neutral', 'alignments', 'True neutral', '{}');
INSERT INTO `types` (id, type, name, config)
     ('chaotic neutral', 'alignments', 'Chaotic neutral', '{}');
INSERT INTO `types` (id, type, name, config)
     ('lawful evil', 'alignments', 'Lawful evil', '{}');
INSERT INTO `types` (id, type, name, config)
     ('neutral evil', 'alignments', 'Neutral evil', '{}');
INSERT INTO `types` (id, type, name, config)
     ('chaotic evil', 'alignments', 'Chaotic evil', '{}');

INSERT INTO `types` (id, type, name, config)
     ('athletics', 'skills', 'Athletics', '{"stat": "strength"}');
INSERT INTO `types` (id, type, name, config)
     ('acrobatics', 'skills', 'Acrobatics', '{"stat": "dexterity"}');
INSERT INTO `types` (id, type, name, config)
     ('sleight of hand', 'skills', 'Sleight of Hand', '{"stat": "dexterity"}');
INSERT INTO `types` (id, type, name, config)
     ('stealth', 'skills', 'Stealth', '{"stat": "dexterity"}');
INSERT INTO `types` (id, type, name, config)
     ('arcana', 'skills', 'Arcana', '{"stat": "intelligence"}');
INSERT INTO `types` (id, type, name, config)
     ('history', 'skills', 'History', '{"stat": "intelligence"}');
INSERT INTO `types` (id, type, name, config)
     ('investigation', 'skills', 'Investigation', '{"stat": "intelligence"}');
INSERT INTO `types` (id, type, name, config)
     ('nature', 'skills', 'Nature', '{"stat": "intelligence"}');
INSERT INTO `types` (id, type, name, config)
     ('religion', 'skills', 'Religion', '{"stat": "intelligence"}');
INSERT INTO `types` (id, type, name, config)
     ('animal handling', 'skills', 'Animal Handling', '{"stat": "wisdom"}');
INSERT INTO `types` (id, type, name, config)
     ('insight', 'skills', 'Insight', '{"stat": "wisdom"}');
INSERT INTO `types` (id, type, name, config)
     ('medicine', 'skills', 'Medicine', '{"stat": "wisdom"}');
INSERT INTO `types` (id, type, name, config)
     ('perception', 'skills', 'Perception', '{"stat": "wisdom"}');
INSERT INTO `types` (id, type, name, config)
     ('survival', 'skills', 'Survival', '{"stat": "wisdom"}');
INSERT INTO `types` (id, type, name, config)
     ('deception', 'skills', 'Deception', '{"stat": "charisma"}');
INSERT INTO `types` (id, type, name, config)
     ('intimidation', 'skills', 'Intimidation', '{"stat": "charisma"}');
INSERT INTO `types` (id, type, name, config)
     ('performance', 'skills', 'Performance', '{"stat": "charisma"}');
INSERT INTO `types` (id, type, name, config)
     ('persuasion', 'skills', 'Persuasion', '{"stat": "charisma"}');

INSERT INTO `types` (id, type, name, config)
     ('common', 'languages', 'Common', '{"group": "common", "speakers": "Humans", "script": "Common"}');
INSERT INTO `types` (id, type, name, config)
     ('dwarvish', 'languages', 'Dwarvish', '{"group": "common", "speakers": "Dwarves", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     ('elvish', 'languages', 'Elvish', '{"group": "common", "speakers": "Elves", "script": "Elvish"}');
INSERT INTO `types` (id, type, name, config)
     ('giant', 'languages', 'Giant', '{"group": "common", "speakers": "Ogres, Giants", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     ('gnomish', 'languages', 'Gnomish', '{"group": "common", "speakers": "Gnomes", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     ('goblin', 'languages', 'Goblin', '{"group": "common", "speakers": "Goblinoids", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     ('halfling', 'languages', 'Halfling', '{"group": "common", "speakers": "Halflings", "script": "Common"}');
INSERT INTO `types` (id, type, name, config)
     ('orc', 'languages', 'Orc', '{"group": "common", "speakers": "Orcs", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     ('abyssal', 'languages', 'Abyssal', '{"group": "exotic", "speakers": "Demons", "script": "Infernal"}');
INSERT INTO `types` (id, type, name, config)
     ('celestial', 'languages', 'Celestial', '{"group": "exotic", "speakers": "Celestials", "script": "Celestial"}');
INSERT INTO `types` (id, type, name, config)
     ('draconic', 'languages', 'Draconic', '{"group": "exotic", "speakers": "Dragons, Dragonborn", "script": "Draconic"}');
INSERT INTO `types` (id, type, name, config)
     ('deep speech', 'languages', 'Deep Speech', '{"group": "exotic", "speakers": "Mind flayers, Beholders"}');
INSERT INTO `types` (id, type, name, config)
     ('infernal', 'languages', 'Infernal', '{"group": "exotic", "speakers": "Devils", "script": "Infernal"}');
INSERT INTO `types` (id, type, name, config)
     ('primordial', 'languages', 'Primordial', '{"group": "exotic", "speakers": "Elementals", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     ('sylvan', 'languages', 'Sylvan', '{"group": "exotic", "speakers": "Fey creatures", "script": "Elvish"}');
INSERT INTO `types` (id, type, name, config)
     ('undercommon', 'languages', 'Undercommon', '{"group": "exotic", "speakers": "Underdark traders", "script": "Elvish"}');

INSERT INTO `types` (id, type, name, config)
     ('strength', 'statistics', 'Strength', '{"short": "Str", "description": "Strength is being able to crush a tomato." }');
INSERT INTO `types` (id, type, name, config)
     ('dexterity', 'statistics', 'Dexterity', '{"short": "Dex", "description": "Dexterity is being able to dodge a tomato." }');
INSERT INTO `types` (id, type, name, config)
     ('constitution', 'statistics', 'Constitution', '{"short": "Con", "description": "Constitution is being able to eat a bad tomato." }');
INSERT INTO `types` (id, type, name, config)
     ('intelligence', 'statistics', 'Intelligence', '{"short": "Int", "description": "Intelligence is knowing a tomato is a fruit." }');
INSERT INTO `types` (id, type, name, config)
     ('wisdom', 'statistics', 'Wisdom', '{"short": "Wis", "description": "Wisdom is knowing not to put a tomato in a fruit salad." }');
INSERT INTO `types` (id, type, name, config)
     ('charisma', 'statistics', 'Charisma', '{"short": "Cha", "description": "Charisma is being able to sell a tomato based fruit salad." }');

INSERT INTO `types` (id, type, name, config)
     ('single', 'target_methods', 'Single target', '{"short": "ST", "description": "One target is affected."}');
INSERT INTO `types` (id, type, name, config)
     ('multiple', 'target_methods', 'Multi-target', '{"short": "MT", "description": "Multiple targets are affected. Usually when clustered together."}');
INSERT INTO `types` (id, type, name, config)
     ('area', 'target_methods', 'Area of Effect', '{"short": "AoE", "description": "An area of a specific size and shape is affected. Every designated target inside is affected."}');

INSERT INTO `types` (id, type, name, config)
     ('melee', 'attack_modes', 'Melee Attack', '{"short": "M", "description": "Melee weapon attack."}');
INSERT INTO `types` (id, type, name, config)
     ('ranged', 'attack_modes', 'Ranged Attack', '{"short": "R", "description": "Ranged weapon attack."}');
INSERT INTO `types` (id, type, name, config)
     ('spell', 'attack_modes', 'Spell Attack', '{"short": "S", "description": "Spell attack."}');

INSERT INTO `types` (id, type, name, config)
     ('acid', 'damage_types', 'Acid', '{"short": "Acd", "description": "The corrosive spray of a black dragon''s breath and the dissolving enzymes secreted by a black pudding deal acid damage." }');
INSERT INTO `types` (id, type, name, config)
     ('bludgeoning', 'damage_types', 'Bludgeoning', '{"short": "Bldg", "description": "Blunt force attacks—hammers, falling, constriction, and the like—deal bludgeoning damage." }');
INSERT INTO `types` (id, type, name, config)
     ('cold', 'damage_types', 'Cold', '{"short": "Cld", "description": "The infernal chill radiating from an ice devil''s spear and the frigid blast of a white dragon''s breath deal cold damage." }');
INSERT INTO `types` (id, type, name, config)
     ('fire', 'damage_types', 'Fire', '{"short": "Fr", "description": "Red dragons breathe fire, and many spells conjure flames to deal fire damage." }');
INSERT INTO `types` (id, type, name, config)
     ('force', 'damage_types', 'Force', '{"short": "Frc", "description": "Force is pure magical energy focused into a damaging form. Most effects that deal force damage are spells, including magic missile and spiritual weapon." }');
INSERT INTO `types` (id, type, name, config)
     ('lightning', 'damage_types', 'Lightning', '{"short": "Ltn", "description": "A lightning bolt spell and a blue dragon''s breath deal lightning damage." }');
INSERT INTO `types` (id, type, name, config)
     ('necrotic', 'damage_types', 'Necrotic', '{"short": "Ncr", "description": "Necrotic damage, dealt by certain undead and a spell such as chill touch, withers matter and even the soul." }');
INSERT INTO `types` (id, type, name, config)
     ('piercing', 'damage_types', 'Piercing', '{"short": "Pcn", "description": "Puncturing and impaling attacks, including spears and monsters'' bites, deal piercing damage." }');
INSERT INTO `types` (id, type, name, config)
     ('poison', 'damage_types', 'Poison', '{"short": "Psn", "description": "Venomous stings and the toxic gas of a green dragon''s breath deal poison damage." }');
INSERT INTO `types` (id, type, name, config)
     ('psychic', 'damage_types', 'Psychic', '{"short": "Psy", "description": "Mental abilities such as a mind flayer''s psionic blast deal psychic damage." }');
INSERT INTO `types` (id, type, name, config)
     ('radiant', 'damage_types', 'Radiant', '{"short": "Rdnt", "description": "Radiant damage, dealt by a cleric''s flame strike spell or an angel''s smiting weapon, sears the flesh like fire and overloads the spirit with power." }');
INSERT INTO `types` (id, type, name, config)
     ('slashing', 'damage_types', 'Slashing', '{"short": "Slsh", "description": "Swords, axes, and monsters'' claws deal slashing damage." }');
INSERT INTO `types` (id, type, name, config)
     ('thunder', 'damage_types', 'Thunder', '{"short": "Tndr", "description": "A concussive burst of sound, such as the effect of the Thunderwave spell, deals thunder damage." }');

INSERT INTO `types` (id, type, name, config)
     ('genderless', 'genders', 'Genderless', '{}');
INSERT INTO `types` (id, type, name, config)
     ('male', 'genders', 'Male', '{}');
INSERT INTO `types` (id, type, name, config)
     ('female', 'genders', 'Female', '{}');

INSERT INTO `types` (id, type, name, config)
     ('verbal', 'magic_components', 'Verbal', '{"short": "V", "description": "Most spells require the chanting of mystic words. The words themselves aren't the source of the spell's power; rather, the particular combination of sounds, with specific pitch and resonance, sets the threads of magic in motion. Thus, a character who is gagged or in an area of silence, such as one created by the **Silence** spell, can''t cast a spell with a **Verbal** component." }');
INSERT INTO `types` (id, type, name, config)
     ('somatic', 'magic_components', 'Somatic', '{"short": "S", "description": "Spellcasting gestures might include a forceful gesticulation or an intricate set of gestures. If a spell requires a **Somatic** component, the caster must have free use of at least one hand to perform these gestures." }');
INSERT INTO `types` (id, type, name, config)
     ('material', 'magic_components', 'Material', '{"short": "M", "description": "Casting some spells requires particular objects, specified in the component entry. A character can use a *Component pouch *or a *Spellcasting focus* in place of the components specified for a spell. But if a cost is indicated for a component, a character must have that specific component before he or she can cast the spell.\n\nIf a spell states that a material component is consumed by the spell, the caster must provide this component for each casting of the spell.\nA spellcaster must have a hand free to access a spell''s material components - or to hold a spellcasting focus - but it can be the same hand that he or she uses to perform somatic components." }');

INSERT INTO `types` (id, type, name, config)
     ('abjuration', 'magic_schools', 'Abjuration', '{"description": "Magic that blocks, banishes, or protects. Detractors of this school say that its tradition is about denial, negation rather than positive assertion. Others say that ending harmful effects, protecting the weak, and banishing evil influences is anything but a philosophical void."}');
INSERT INTO `types` (id, type, name, config)
     ('conjuration', 'magic_schools', 'Conjuration', '{"description": "Spells that produce objects and creatures out of thin air. Ranging from billowing clouds of killing fog or summon creatures from elsewhere to fight on your behalf."}');
INSERT INTO `types` (id, type, name, config)
     ('divination', 'magic_schools', 'Divination', '{"description": "Spells of discernment, remote viewing, supernatural knowledge, and foresight."}');
INSERT INTO `types` (id, type, name, config)
     ('enchantment', 'magic_schools', 'Enchantment', '{"description": "Abilities to magically entrance and beguile people and monsters."}');
INSERT INTO `types` (id, type, name, config)
     ('evocation', 'magic_schools', 'Evocation', '{"description": "Magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid."}');
INSERT INTO `types` (id, type, name, config)
     ('illusion', 'magic_schools', 'Illusion', '{"description": "Magic that dazzles the senses, befuddles the mind, and tricks even the wisest folk."}');
INSERT INTO `types` (id, type, name, config)
     ('necromancy', 'magic_schools', 'Necromancy', '{"description": "Concerns the cosmic forces of life, death, and undeath. Manipulates the energy that animates all living things."}');
INSERT INTO `types` (id, type, name, config)
     ('transmutation', 'magic_schools', 'Transmutation', '{"description": "Spells that modify energy and matter."}');

INSERT INTO `types` (id, type, name, config)
     ('Aasimar', 'humanoid_types', 'Aasimar', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Bugbear', 'humanoid_types', 'Bugbear', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Bullywug', 'humanoid_types', 'Bullywug', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Catfolk', 'humanoid_types', 'Catfolk', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Darfellan', 'humanoid_types', 'Darfellan', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Dark One', 'humanoid_types', 'Dark One', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Dragonborn', 'humanoid_types', 'Dragonborn', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Drow', 'humanoid_types', 'Drow', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Dwarf', 'humanoid_types', 'Dwarf', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Eladrin', 'humanoid_types', 'Eladrin', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Elf', 'humanoid_types', 'Elf', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Genasi', 'humanoid_types', 'Genasi', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Gibberling', 'humanoid_types', 'Gibberling', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Githyanki', 'humanoid_types', 'Githyanki', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Githzerai', 'humanoid_types', 'Githzerai', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Gnoll', 'humanoid_types', 'Gnoll', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Gnome', 'humanoid_types', 'Gnome', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Goblin', 'humanoid_types', 'Goblin', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Goliath', 'humanoid_types', 'Goliath', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Grippli', 'humanoid_types', 'Grippli', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Half-Elf', 'humanoid_types', 'Half-Elf', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Half-Orc', 'humanoid_types', 'Half-Orc', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Halfling', 'humanoid_types', 'Halfling', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Hobgoblin', 'humanoid_types', 'Hobgoblin', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Human', 'humanoid_types', 'Human', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Kenku', 'humanoid_types', 'Kenku', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Kobold', 'humanoid_types', 'Kobold', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Lizardfolk', 'humanoid_types', 'Lizardfolk', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Locathah', 'humanoid_types', 'Locathah', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Merfolk', 'humanoid_types', 'Merfolk', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Mongrelfolk', 'humanoid_types', 'Mongrelfolk', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Mul', 'humanoid_types', 'Mul', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Nilbog', 'humanoid_types', 'Nilbog', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Norker', 'humanoid_types', 'Norker', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Orc', 'humanoid_types', 'Orc', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Orog', 'humanoid_types', 'Orog', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Rakasta', 'humanoid_types', 'Rakasta', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Saurial', 'humanoid_types', 'Saurial', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Selkie', 'humanoid_types', 'Selkie', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Shifter', 'humanoid_types', 'Shifter', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Skulk', 'humanoid_types', 'Skulk', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Swanmay', 'humanoid_types', 'Swanmay', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Tasloi', 'humanoid_types', 'Tasloi', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Tiefling', 'humanoid_types', 'Tiefling', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Troglodyte', 'humanoid_types', 'Troglodyte', '{}');

INSERT INTO `types` (id, type, name, config)
     ('Aberration', 'monster_types', 'Aberration', '{"description": "Aberration", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     ('Beast', 'monster_types', 'Beast', '{"description": "Beast", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     ('Celestial', 'monster_types', 'Celestial', '{"description": "Celestial", "intelligent": true}');
INSERT INTO `types` (id, type, name, config)
     ('Construct', 'monster_types', 'Construct', '{"description": "Construct", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     ('Dragon', 'monster_types', 'Dragon', '{"description": "Dragon", "intelligent": true}');
INSERT INTO `types` (id, type, name, config)
     ('Elemental', 'monster_types', 'Elemental', '{"description": "Elemental", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     ('Fey', 'monster_types', 'Fey', '{"description": "Fey", "intelligent": true}');
INSERT INTO `types` (id, type, name, config)
     ('Fiend', 'monster_types', 'Fiend', '{"description": "Fiend", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     ('Giant', 'monster_types', 'Giant', '{"description": "Giant", "intelligent": true}');
INSERT INTO `types` (id, type, name, config)
     ('Humanoid', 'monster_types', 'Humanoid', '{"description": "Humanoid", "intelligent": true}');
INSERT INTO `types` (id, type, name, config)
     ('Monstrosity', 'monster_types', 'Monstrosity', '{"description": "Monstrosity", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     ('Ooze', 'monster_types', 'Ooze', '{"description": "Ooze", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     ('Plant', 'monster_types', 'Plant', '{"description": "Plant", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     ('Undead', 'monster_types', 'Undead', '{"description": "Undead", "intelligent": false}');

INSERT INTO `types` (id, type, name, config)
     ('Arctic', 'terrain_types', 'Arctic', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Coast', 'terrain_types', 'Coast', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Desert', 'terrain_types', 'Desert', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Forest', 'terrain_types', 'Forest', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Grassland', 'terrain_types', 'Grassland', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Mountain', 'terrain_types', 'Mountain', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Swamp', 'terrain_types', 'Swamp', '{}');
INSERT INTO `types` (id, type, name, config)
     ('Underdark', 'terrain_types', 'Underdark', '{}');

INSERT INTO `types` (id, type, name, config)
     ('light', 'armor_types', 'Light Armor', '{}');
INSERT INTO `types` (id, type, name, config)
     ('medium', 'armor_types', 'Medium Armor', '{}');
INSERT INTO `types` (id, type, name, config)
     ('heavy', 'armor_types', 'Heavy Armor', '{}');
INSERT INTO `types` (id, type, name, config)
     ('shield', 'armor_types', 'Shields', '{}');

INSERT INTO `types` (id, type, name, config)
     ('simple melee', 'weapon_types', 'Simple Melee Weapon', '{"short": "Melee"}');
INSERT INTO `types` (id, type, name, config)
     ('simple ranged', 'weapon_types', 'Simple Ranged Weapon', '{"short": "Ranged"}');
INSERT INTO `types` (id, type, name, config)
     ('martial melee', 'weapon_types', 'Martial Melee Weapon', '{"short": "Melee"}');
INSERT INTO `types` (id, type, name, config)
     ('martial ranged', 'weapon_types', 'Martial Ranged Weapon', '{"short": "Ranged"}');

INSERT INTO `types` (id, type, name, config)
     ('artisan', 'equipment_types', 'Artisan''s Tool', '{}');
INSERT INTO `types` (id, type, name, config)
     ('gaming', 'equipment_types', 'Gaming Set', '{}');
INSERT INTO `types` (id, type, name, config)
     ('kit', 'equipment_types', 'Kits', '{}');
INSERT INTO `types` (id, type, name, config)
     ('musical', 'equipment_types', 'Musical Instrument', '{}');
INSERT INTO `types` (id, type, name, config)
     ('gear', 'equipment_types', 'Adventuring Gear', '{}');
INSERT INTO `types` (id, type, name, config)
     ('trinket', 'equipment_types', 'Trinkets', '{}');
COMMIT;
