import React from 'react';
import {
    ComputeChange,
} from 'components/Character/ComputeChange.jsx';

describe('Function: ComputeChange', () => {
    describe('received undefined value', () => {
        const original = {};
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: undefined,
                option: {},
            },
        }, original);

        it('should be ignored', () => {
            expect(change).toMatchSnapshot()
        });

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should not mutate unrelated paths', () => {
            expect(change === original).toBeTruthy();
        });
    });

    describe('received undefined options', () => {
        const original = {};
        const change = ComputeChange({
            'id_1': undefined,
        }, original);

        it('should be ignored', () => {
            expect(change)
                .toMatchSnapshot();
        });

        it('should not affect original', () => {
            expect(original).toMatchSnapshot()
        });

        it('should not mutate unrelated paths', () => {
            expect(change === original).toBeTruthy();
        });
    });

    describe('received null value', () => {
        const original = {other: {is: 'immutable'}};
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: null,
                option: {},
            },
        }, original);

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

    describe('received value for value', () => {
        const original = {other: {is: 'immutable'}};
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: 'foo',
                option: {
                    type: 'value',
                }
            },
        }, original);

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
        const original = {other: {is: 'immutable'}};
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: 'bar',
                option: {
                    type: 'select',
                }
            },
        }, original);

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
            other: {is: 'immutable'},
        };
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: {
                    value: 'rab',
                },
                option: {
                    type: 'dict',
                }
            },
        }, original);

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
            other: {is: 'immutable'},
        };
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: {
                    added: ['foo'],
                    removed: ['bar'],
                },
                option: {
                    type: 'list',
                }
            },
        }, original);

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
            other: {is: 'immutable'},
        };
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: {
                    added: ['foo'],
                    removed: ['one'],
                },
                option: {
                    type: 'list',
                    multiple: true,
                }
            },
        }, original);

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

    it('should complain about unknown option type', () => {
        expect(
            () => ComputeChange({
                'id_1': {
                    path: 'some.path',
                    value: -1,
                    option: {
                        type: 'unknown',
                    }
                },
            }, {})
        ).toThrow();
    });
});