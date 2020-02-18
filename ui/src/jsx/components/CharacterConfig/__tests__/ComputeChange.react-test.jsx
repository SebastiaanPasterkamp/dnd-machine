import {
    ComputeChange,
} from '../utils';

describe('Function: ComputeChange', () => {
    describe('received null value', () => {
        const original = { other: { is: 'immutable' } };
        const change = ComputeChange([
            {
                option: { type: 'value', path: 'some.path', value: null },
                choice: true,
            },
        ], original);

        it('should be set', () => {
            expect(change).toMatchSnapshot();
        });

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should mutate affected paths', () => {
            expect(change === original).toBeFalsy();
        });

        it('should not mutate unrelated paths', () => {
            expect(change.other === original.other).toBeTruthy();
        });
    });

    describe('return original if nothing changed', () => {
        const original = { some: { path: 'foo' }, other: { is: 'immutable' } };
        const change = ComputeChange([
            {
                option: { type: 'value', path: 'some.path', value: 'foo' },
                choice: true,
            },
        ], original);

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should return the original if unchanged', () => {
            expect(change === original).toBeTruthy();
        });

        it('should be identical to the original', () => {
            expect(change).toEqual(original);
        });

        it('should not mutate any paths', () => {
            expect(change.some === original.some).toBeTruthy();
            expect(change.some.path === original.some.path).toBeTruthy();
            expect(change.other === original.other).toBeTruthy();
        });
    });

    describe('received value for value', () => {
        const original = { other: { is: 'immutable' } };
        const change = ComputeChange([
            {
                option: { type: 'value', path: 'some.path', value: 'foo' },
                choice: true,
            },
        ], original);

        it('should be set', () => {
            expect(change).toMatchSnapshot();
        });

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should mutate affected paths', () => {
            expect(change === original).toBeFalsy();
        });

        it('should not mutate unrelated paths', () => {
            expect(change.other === original.other).toBeTruthy();
        });
    });

    describe('received value for select', () => {
        const original = {other: { is: 'immutable' }};
        const change = ComputeChange([
            {
                option: { type: 'select', path: 'some.path' },
                choice: { current: 'bar' },
            },
        ], original);

        it('should be set', () => {
            expect(change).toMatchSnapshot();
        });

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should mutate affected paths', () => {
            expect(change === original).toBeFalsy();
        });

        it('should not mutate unrelated paths', () => {
            expect(change.other === original.other).toBeTruthy();
        });
    });

    describe('received dicts', () => {
        const original = {
            some: {
                path: {
                    description: 'foo',
                    value: 'bar',
                }
            },
            other: { is: 'immutable' },
        };
        const change = ComputeChange([
            {
                option: { type: 'dict', path: 'some.path', dict: { value: 'rab' } },
                choice: true,
            }
        ], original);

        it('should be merged', () => {
            expect(change).toMatchSnapshot();
        });

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should mutate affected paths', () => {
            expect(change === original).toBeFalsy();
            expect(change.some === original.some).toBeFalsy();
            expect(change.some.path === original.some.path).toBeFalsy();
        });

        it('should not mutate unrelated paths', () => {
            expect(change.other === original.other).toBeTruthy();
        });
    });

    describe('mutations to lists', () => {
        const original = {
            some: {
                path: ['one', 'bar', 'one', 'foo',],
            },
            other: { is: 'immutable' },
        };
        const change = ComputeChange([
            {
                option: { type: 'list', path: 'some.path', given: ['ruh'] },
                choice: { added: ['foo'], removed: ['bar'] },
            },
        ], original);

        it('should apply', () => {
            expect(change).toMatchSnapshot();
        });

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should mutate affected paths', () => {
            expect(change === original).toBeFalsy();
            expect(change.some === original.some).toBeFalsy();
            expect(change.some.path === original.some.path).toBeFalsy();
        });

        it('should not mutate unrelated paths', () => {
            expect(change.other === original.other).toBeTruthy();
        });
    });

    describe('mutations to lists with duplicates', () => {
        const original = {
            some: {
                path: ['one', 'bar', 'two', 'foo',],
            },
            other: { is: 'immutable' },
        };
        const change = ComputeChange([
            {
                option: { type: 'list', path: 'some.path', multiple: true },
                choice: { added: ['foo'], removed: ['one'] },
            },
        ], original);

        it('should apply and keep duplicates', () => {
            expect(change).toMatchSnapshot();
        });

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should mutate affected paths', () => {
            expect(change === original).toBeFalsy();
            expect(change.some === original.some).toBeFalsy();
            expect(change.some.path === original.some.path).toBeFalsy();
        });

        it('should not mutate unrelated paths', () => {
            expect(change.other === original.other).toBeTruthy();
        });
    });

    describe('mutations to bonuses with ability_score', () => {
        const original = {
            statistics: {
                bare: {},
                base: {},
                bonus: {
                    foo: [1],
                    bar: [2,1],
                    ruh: [],
                },
                modifiers: {},
            },
            other: { is: 'immutable' },
        };
        const change = ComputeChange([
            {
                option: { type: 'ability_score' },
                choice: { improvement: ['bar', 'ruh'] },
            },
        ], original);

        it('should increase selected, but keep others unchanged', () => {
            expect(change).toMatchSnapshot();
        });

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should mutate affected paths', () => {
            expect(change === original).toBeFalsy();
            expect(change.statistics === original.statistics).toBeFalsy();
            expect(change.statistics.bonus === original.statistics.bonus).toBeFalsy();
        });

        it('should not mutate unrelated paths', () => {
            expect(change.other === original.other).toBeTruthy();
            expect(change.statistics.base === original.statistics.base).toBeTruthy();
        });
    });

    describe('mutations to bare stats with statistics', () => {
        const original = {
            statistics: {
                bare: {
                    foo: 8,
                    bar: 10,
                },
                base: {},
                bonus: {},
                modifiers: {},
            },
            other: { is: 'immutable' },
        };
        const change = ComputeChange([
            {
                option: { type: 'statistics' },
                choice: { bare: { bar: 14, ruh: 10 } },
            },
        ], original);

        it('should apply configured, but keep others unchanged', () => {
            expect(change).toMatchSnapshot();
        });

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should mutate affected paths', () => {
            expect(change === original).toBeFalsy();
            expect(change.statistics === original.statistics).toBeFalsy();
            expect(change.statistics.bare === original.statistics.bare).toBeFalsy();
        });

        it('should not mutate unrelated paths', () => {
            expect(change.other === original.other).toBeTruthy();
            expect(change.statistics.bonus === original.statistics.bonus).toBeTruthy();
        });
    });

    it('should complain about unknown option type', () => {
        expect(
            () => ComputeChange([
                { option: { type: 'unknown' }, choice: true },
            ], {})
        ).toThrow();
    });
});
