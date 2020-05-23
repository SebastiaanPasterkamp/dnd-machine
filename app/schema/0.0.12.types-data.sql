-- Create and populate 'types' table

DROP TABLE IF EXISTS `types`;
CREATE TABLE `types` (
  `id` VARCHAR(32) NOT NULL,
  `type` TEXT NOT NULL,
  `name` TEXT NOT NULL,
  `config` TEXT,
  UNIQUE(`id`, `type`)
);

BEGIN TRANSACTION;
INSERT INTO `types` (id, type, name, config)
    VALUES ('admin', 'user_roles', 'Site Administrator', '{}');
INSERT INTO `types` (id, type, name, config)
    VALUES ('dm', 'user_roles', 'Dungeon Master', '{}');
INSERT INTO `types` (id, type, name, config)
    VALUES ('player', 'user_roles', 'Player', '{}');

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
     VALUES ('unaligned', 'alignments', 'Unaligned', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('lawful good', 'alignments', 'Lawful good', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('neutral good', 'alignments', 'Neutral good', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('chaotic good', 'alignments', 'Chaotic good', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('lawful neutral', 'alignments', 'Lawful neutral', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('true neutral', 'alignments', 'True neutral', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('chaotic neutral', 'alignments', 'Chaotic neutral', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('lawful evil', 'alignments', 'Lawful evil', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('neutral evil', 'alignments', 'Neutral evil', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('chaotic evil', 'alignments', 'Chaotic evil', '{}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('athletics', 'skills', 'Athletics', '{"stat": "strength"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('acrobatics', 'skills', 'Acrobatics', '{"stat": "dexterity"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('sleight of hand', 'skills', 'Sleight of Hand', '{"stat": "dexterity"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('stealth', 'skills', 'Stealth', '{"stat": "dexterity"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('arcana', 'skills', 'Arcana', '{"stat": "intelligence"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('history', 'skills', 'History', '{"stat": "intelligence"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('investigation', 'skills', 'Investigation', '{"stat": "intelligence"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('nature', 'skills', 'Nature', '{"stat": "intelligence"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('religion', 'skills', 'Religion', '{"stat": "intelligence"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('animal handling', 'skills', 'Animal Handling', '{"stat": "wisdom"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('insight', 'skills', 'Insight', '{"stat": "wisdom"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('medicine', 'skills', 'Medicine', '{"stat": "wisdom"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('perception', 'skills', 'Perception', '{"stat": "wisdom"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('survival', 'skills', 'Survival', '{"stat": "wisdom"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('deception', 'skills', 'Deception', '{"stat": "charisma"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('intimidation', 'skills', 'Intimidation', '{"stat": "charisma"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('performance', 'skills', 'Performance', '{"stat": "charisma"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('persuasion', 'skills', 'Persuasion', '{"stat": "charisma"}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('common', 'languages', 'Common', '{"group": "common", "speakers": "Humans", "script": "Common"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('dwarvish', 'languages', 'Dwarvish', '{"group": "common", "speakers": "Dwarves", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('elvish', 'languages', 'Elvish', '{"group": "common", "speakers": "Elves", "script": "Elvish"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('giant', 'languages', 'Giant', '{"group": "common", "speakers": "Ogres, Giants", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('gnomish', 'languages', 'Gnomish', '{"group": "common", "speakers": "Gnomes", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('goblin', 'languages', 'Goblin', '{"group": "common", "speakers": "Goblinoids", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('halfling', 'languages', 'Halfling', '{"group": "common", "speakers": "Halflings", "script": "Common"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('orc', 'languages', 'Orc', '{"group": "common", "speakers": "Orcs", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('abyssal', 'languages', 'Abyssal', '{"group": "exotic", "speakers": "Demons", "script": "Infernal"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('celestial', 'languages', 'Celestial', '{"group": "exotic", "speakers": "Celestials", "script": "Celestial"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('draconic', 'languages', 'Draconic', '{"group": "exotic", "speakers": "Dragons, Dragonborn", "script": "Draconic"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('deep speech', 'languages', 'Deep Speech', '{"group": "exotic", "speakers": "Mind flayers, Beholders"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('infernal', 'languages', 'Infernal', '{"group": "exotic", "speakers": "Devils", "script": "Infernal"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('primordial', 'languages', 'Primordial', '{"group": "exotic", "speakers": "Elementals", "script": "Dwarvish"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('sylvan', 'languages', 'Sylvan', '{"group": "exotic", "speakers": "Fey creatures", "script": "Elvish"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('undercommon', 'languages', 'Undercommon', '{"group": "exotic", "speakers": "Underdark traders", "script": "Elvish"}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('strength', 'statistics', 'Strength', '{"short": "Str", "prio": 1, "description": "Strength is being able to crush a tomato." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('dexterity', 'statistics', 'Dexterity', '{"short": "Dex", "prio": 2, "description": "Dexterity is being able to dodge a tomato." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('constitution', 'statistics', 'Constitution', '{"short": "Con", "prio": 3, "description": "Constitution is being able to eat a bad tomato." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('intelligence', 'statistics', 'Intelligence', '{"short": "Int", "prio": 4, "description": "Intelligence is knowing a tomato is a fruit." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('wisdom', 'statistics', 'Wisdom', '{"short": "Wis", "prio": 5, "description": "Wisdom is knowing not to put a tomato in a fruit salad." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('charisma', 'statistics', 'Charisma', '{"short": "Cha", "prio": 6, "description": "Charisma is being able to sell a tomato based fruit salad." }');

INSERT INTO `types` (id, type, name, config)
     VALUES ('single', 'target_methods', 'Single target', '{"short": "ST", "description": "One target is affected."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('multiple', 'target_methods', 'Multi-target', '{"short": "MT", "description": "Multiple targets are affected. Usually when clustered together."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('area', 'target_methods', 'Area of Effect', '{"short": "AoE", "description": "An area of a specific size and shape is affected. Every designated target inside is affected."}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('melee', 'attack_modes', 'Melee Attack', '{"short": "M", "description": "Melee weapon attack."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('ranged', 'attack_modes', 'Ranged Attack', '{"short": "R", "description": "Ranged weapon attack."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('spell', 'attack_modes', 'Spell Attack', '{"short": "S", "description": "Spell attack."}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('acid', 'damage_types', 'Acid', '{"short": "Acd", "description": "The corrosive spray of a black dragon''s breath and the dissolving enzymes secreted by a black pudding deal acid damage." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('bludgeoning', 'damage_types', 'Bludgeoning', '{"short": "Bldg", "description": "Blunt force attacks—hammers, falling, constriction, and the like—deal bludgeoning damage." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('cold', 'damage_types', 'Cold', '{"short": "Cld", "description": "The infernal chill radiating from an ice devil''s spear and the frigid blast of a white dragon''s breath deal cold damage." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('fire', 'damage_types', 'Fire', '{"short": "Fr", "description": "Red dragons breathe fire, and many spells conjure flames to deal fire damage." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('force', 'damage_types', 'Force', '{"short": "Frc", "description": "Force is pure magical energy focused into a damaging form. Most effects that deal force damage are spells, including magic missile and spiritual weapon." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('lightning', 'damage_types', 'Lightning', '{"short": "Ltn", "description": "A lightning bolt spell and a blue dragon''s breath deal lightning damage." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('necrotic', 'damage_types', 'Necrotic', '{"short": "Ncr", "description": "Necrotic damage, dealt by certain undead and a spell such as chill touch, withers matter and even the soul." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('piercing', 'damage_types', 'Piercing', '{"short": "Pcn", "description": "Puncturing and impaling attacks, including spears and monsters'' bites, deal piercing damage." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('poison', 'damage_types', 'Poison', '{"short": "Psn", "description": "Venomous stings and the toxic gas of a green dragon''s breath deal poison damage." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('psychic', 'damage_types', 'Psychic', '{"short": "Psy", "description": "Mental abilities such as a mind flayer''s psionic blast deal psychic damage." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('radiant', 'damage_types', 'Radiant', '{"short": "Rdnt", "description": "Radiant damage, dealt by a cleric''s flame strike spell or an angel''s smiting weapon, sears the flesh like fire and overloads the spirit with power." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('slashing', 'damage_types', 'Slashing', '{"short": "Slsh", "description": "Swords, axes, and monsters'' claws deal slashing damage." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('thunder', 'damage_types', 'Thunder', '{"short": "Tndr", "description": "A concussive burst of sound, such as the effect of the Thunderwave spell, deals thunder damage." }');

INSERT INTO `types` (id, type, name, config)
     VALUES ('genderless', 'genders', 'Genderless', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('male', 'genders', 'Male', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('female', 'genders', 'Female', '{}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('verbal', 'magic_components', 'Verbal', '{"short": "V", "description": "Most spells require the chanting of mystic words. The words themselves aren''t the source of the spell''s power; rather, the particular combination of sounds, with specific pitch and resonance, sets the threads of magic in motion. Thus, a character who is gagged or in an area of silence, such as one created by the **Silence** spell, can''t cast a spell with a **Verbal** component." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('somatic', 'magic_components', 'Somatic', '{"short": "S", "description": "Spellcasting gestures might include a forceful gesticulation or an intricate set of gestures. If a spell requires a **Somatic** component, the caster must have free use of at least one hand to perform these gestures." }');
INSERT INTO `types` (id, type, name, config)
     VALUES ('material', 'magic_components', 'Material', '{"short": "M", "description": "Casting some spells requires particular objects, specified in the component entry. A character can use a *Component pouch *or a *Spellcasting focus* in place of the components specified for a spell. But if a cost is indicated for a component, a character must have that specific component before he or she can cast the spell.\n\nIf a spell states that a material component is consumed by the spell, the caster must provide this component for each casting of the spell.\nA spellcaster must have a hand free to access a spell''s material components - or to hold a spellcasting focus - but it can be the same hand that he or she uses to perform somatic components." }');

INSERT INTO `types` (id, type, name, config)
     VALUES ('abjuration', 'magic_schools', 'Abjuration', '{"description": "You protect the frog."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('conjuration', 'magic_schools', 'Conjuration', '{"description": "You make a frog appear."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('divination', 'magic_schools', 'Divination', '{"description": "You know that it was actually a toad and not a frog the whole time."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('enchantment', 'magic_schools', 'Enchantment', '{"description": "You make someone think they''re a frog."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('evocation', 'magic_schools', 'Evocation', '{"description": "You kill the frog."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('illusion', 'magic_schools', 'Illusion', '{"description": "You make someone look like a frog."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('necromancy', 'magic_schools', 'Necromancy', '{"description": "You revive the dead frog."}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('transmutation', 'magic_schools', 'Transmutation', '{"description": "You turn someone into a frog."}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('Aasimar', 'humanoid_types', 'Aasimar', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Bugbear', 'humanoid_types', 'Bugbear', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Bullywug', 'humanoid_types', 'Bullywug', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Catfolk', 'humanoid_types', 'Catfolk', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Darfellan', 'humanoid_types', 'Darfellan', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Dark One', 'humanoid_types', 'Dark One', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Dragonborn', 'humanoid_types', 'Dragonborn', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Drow', 'humanoid_types', 'Drow', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Dwarf', 'humanoid_types', 'Dwarf', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Eladrin', 'humanoid_types', 'Eladrin', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Elf', 'humanoid_types', 'Elf', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Genasi', 'humanoid_types', 'Genasi', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Gibberling', 'humanoid_types', 'Gibberling', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Githyanki', 'humanoid_types', 'Githyanki', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Githzerai', 'humanoid_types', 'Githzerai', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Gnoll', 'humanoid_types', 'Gnoll', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Gnome', 'humanoid_types', 'Gnome', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Goblin', 'humanoid_types', 'Goblin', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Goliath', 'humanoid_types', 'Goliath', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Grippli', 'humanoid_types', 'Grippli', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Half-Elf', 'humanoid_types', 'Half-Elf', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Half-Orc', 'humanoid_types', 'Half-Orc', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Halfling', 'humanoid_types', 'Halfling', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Hobgoblin', 'humanoid_types', 'Hobgoblin', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Human', 'humanoid_types', 'Human', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Kenku', 'humanoid_types', 'Kenku', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Kobold', 'humanoid_types', 'Kobold', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Lizardfolk', 'humanoid_types', 'Lizardfolk', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Locathah', 'humanoid_types', 'Locathah', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Merfolk', 'humanoid_types', 'Merfolk', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Mongrelfolk', 'humanoid_types', 'Mongrelfolk', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Mul', 'humanoid_types', 'Mul', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Nilbog', 'humanoid_types', 'Nilbog', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Norker', 'humanoid_types', 'Norker', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Orc', 'humanoid_types', 'Orc', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Orog', 'humanoid_types', 'Orog', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Rakasta', 'humanoid_types', 'Rakasta', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Saurial', 'humanoid_types', 'Saurial', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Selkie', 'humanoid_types', 'Selkie', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Shifter', 'humanoid_types', 'Shifter', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Skulk', 'humanoid_types', 'Skulk', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Swanmay', 'humanoid_types', 'Swanmay', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Tasloi', 'humanoid_types', 'Tasloi', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Tiefling', 'humanoid_types', 'Tiefling', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Troglodyte', 'humanoid_types', 'Troglodyte', '{}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('Aberration', 'monster_types', 'Aberration', '{"description": "Aberration", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Beast', 'monster_types', 'Beast', '{"description": "Beast", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Celestial', 'monster_types', 'Celestial', '{"description": "Celestial", "intelligent": true}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Construct', 'monster_types', 'Construct', '{"description": "Construct", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Dragon', 'monster_types', 'Dragon', '{"description": "Dragon", "intelligent": true}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Elemental', 'monster_types', 'Elemental', '{"description": "Elemental", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Fey', 'monster_types', 'Fey', '{"description": "Fey", "intelligent": true}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Fiend', 'monster_types', 'Fiend', '{"description": "Fiend", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Giant', 'monster_types', 'Giant', '{"description": "Giant", "intelligent": true}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Humanoid', 'monster_types', 'Humanoid', '{"description": "Humanoid", "intelligent": true}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Monstrosity', 'monster_types', 'Monstrosity', '{"description": "Monstrosity", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Ooze', 'monster_types', 'Ooze', '{"description": "Ooze", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Plant', 'monster_types', 'Plant', '{"description": "Plant", "intelligent": false}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Undead', 'monster_types', 'Undead', '{"description": "Undead", "intelligent": false}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('Arctic', 'terrain_types', 'Arctic', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Coast', 'terrain_types', 'Coast', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Desert', 'terrain_types', 'Desert', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Forest', 'terrain_types', 'Forest', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Grassland', 'terrain_types', 'Grassland', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Mountain', 'terrain_types', 'Mountain', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Swamp', 'terrain_types', 'Swamp', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('Underdark', 'terrain_types', 'Underdark', '{}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('light', 'armor_types', 'Light Armor', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('medium', 'armor_types', 'Medium Armor', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('heavy', 'armor_types', 'Heavy Armor', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('shield', 'armor_types', 'Shields', '{}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('simple melee', 'weapon_types', 'Simple Melee Weapon', '{"short": "Melee"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('simple ranged', 'weapon_types', 'Simple Ranged Weapon', '{"short": "Ranged"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('martial melee', 'weapon_types', 'Martial Melee Weapon', '{"short": "Melee"}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('martial ranged', 'weapon_types', 'Martial Ranged Weapon', '{"short": "Ranged"}');

INSERT INTO `types` (id, type, name, config)
     VALUES ('artisan', 'equipment_types', 'Artisan''s Tool', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('gaming', 'equipment_types', 'Gaming Set', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('kit', 'equipment_types', 'Kits', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('musical', 'equipment_types', 'Musical Instrument', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('gear', 'equipment_types', 'Adventuring Gear', '{}');
INSERT INTO `types` (id, type, name, config)
     VALUES ('trinket', 'equipment_types', 'Trinkets', '{}');
COMMIT;
