import {
    CollectChanges,
} from '../utils';

import {
    ability_score,
    choice,
    config,
    dict,
    list,
    list_array,
    list_object,
    manual,
    multichoice,
    select,
    statistics,
    value,
} from './__mocks__/example_configs';

describe('Function: CollectChanges', () => {
    describe('when working with minimum arguments', () => {
        const { record, changes } = CollectChanges([], {});

        it('should not record anything', () => {
            expect(record).toEqual({});
        });

        it('should not change anything', () => {
            expect(changes).toEqual([]);
        });
    });

    describe('when encountering an unknown configuration', () => {
        it('should complain about the unknown type', () => {
            expect(
                () => CollectChanges(
                    [ {type: 'unknown', uuid: 'f00b4r'} ],
                    {},
                )
            ).toThrow();
        });
    });

    describe('when filtering out undesired paths', () => {
        const { record, changes } = CollectChanges(
            [value, dict],
            {},
            dict.path
        );

        it('should record only matching paths', () => {
            expect(record).toEqual({
                [dict.uuid]: true,
            });
        });

        it('should record only specific path changes', () => {
            expect(changes).toEqual([
                { option: dict },
            ]);
        });
    });

    describe('when processing configuration for ability_score', () => {
        const choices = {
            [ability_score.uuid]: { improve: ['strength', 'wisdom'] },
        };
        const { record, changes } = CollectChanges(
            [ ability_score ],
            choices,
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: ability_score, choice: { improve: ['strength', 'wisdom'] } },
            ]);
        });
    });

    describe('when processing configuration for dict', () => {
        const choices = {
            [dict.uuid]: true,
        };
        const { record, changes } = CollectChanges(
            [ dict ],
            {},
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: dict },
            ]);
        });
    });

    describe('when processing configuration for simple lists', () => {
        const choices = {
            [list.uuid]: { added: ['strength', 'charisma'], removed: ['wisdom'] },
        };
        const { record, changes } = CollectChanges(
            [ list ],
            choices,
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: list, choice: { added: ['strength', 'charisma'], removed: ['wisdom'] } },
            ]);
        });
    });

    describe('when processing configuration for array lists', () => {
        const choices = {
            [list_array.uuid]: { added: ['ruh'], removed: [] },
        };
        const { record, changes } = CollectChanges(
            [ list_array ],
            choices,
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: list_array, choice: { added: ['ruh'], removed: [] } },
            ]);
        });
    });

    describe('when processing configuration for object lists', () => {
        const choices = {
            [list_object.uuid]: { added: ['strength'], removed: ['bar'] },
        };
        const { record, changes } = CollectChanges(
            [ list_object ],
            choices,
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: list_object, choice: { added: ['strength'], removed: ['bar'] } },
            ]);
        });
    });

    describe('when processing configuration for manual input', () => {
        const choices = {
            [manual.uuid]: { current: 'Manual entry' },
        };
        const { record, changes } = CollectChanges(
            [ manual ],
            choices,
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: manual, choice: { current: 'Manual entry' } },
            ]);
        });
    });

    describe('when processing configuration for select', () => {
        const choices = {
            [select.uuid]: { current: 'charisma' },
        };
        const { record, changes } = CollectChanges(
            [ select ],
            choices,
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: select, choice: { current: 'charisma' } },
            ]);
        });
    });

    describe('when processing configuration for simple values', () => {
        const choices = {
            [value.uuid]: true,
        };
        const { record, changes } = CollectChanges(
            [ value ],
            {},
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: value },
            ]);
        });
    });

    describe('when processing configuration for nested config', () => {
        const choices = {
            [config.uuid]: true,
            [config.config[0].uuid]: true,
        };
        const { record, changes } = CollectChanges(
            [ config ],
            {},
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: config.config[0] },
            ]);
        });
    });

    describe('when processing configuration for multichoice', () => {
        const choices = {
            [multichoice.uuid]: {
                added: [ multichoice.options[0].uuid ],
                removed: [ multichoice.options[1].uuid ],
            },
            [multichoice.options[0].uuid]: true,
        };
        const { record, changes } = CollectChanges(
            [ multichoice ],
            choices,
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: multichoice.options[0], choice: true },
            ]);
        });
    });

    describe('when encountering an unknown option for (multi)choice', () => {
        const choices = {
            [multichoice.uuid]: {
                added: [ 'unknown' ],
                removed: [],
            },
        };

        it('should complain about the missing option', () => {
            expect(
                () => CollectChanges(
                    [ multichoice ],
                    choices,
                )
            ).toThrow();
        });
    });

    describe('when processing configuration for nested choices', () => {
        const choices = {
            [choice.uuid]: { selected: choice.options[0].uuid },
            [choice.options[0].uuid]: true,
            [choice.options[0].config[0].uuid]: true,
        };
        const { record, changes } = CollectChanges(
            [ choice ],
            {
                [choice.uuid]: { selected: choice.options[0].uuid },
            },
        );

        it('should record all selected uuids', () => {
            expect(record).toEqual(choices);
        });

        it('should record all selected changes', () => {
            expect(changes).toEqual([
                { option: choice.options[0].config[0] },
            ]);
        });
    });
});
