import React from 'react';
import ComputeChange from 'components/Character/ComputeChange.jsx';

describe('Function: ComputeChange', () => {
    it('should skip undefined value', () => {
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: undefined,
                option: {},
            },
        }, {});

        expect(change)
            .toMatchSnapshot();
    });

    it('should skip undefined options', () => {
        const change = ComputeChange({
            'id_1': undefined,
        }, {});

        expect(change)
            .toMatchSnapshot();
    });

    it('should set null value', () => {
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: null,
                option: {},
            },
        }, {});

        expect(change)
            .toMatchSnapshot();
    });

    it('should set value for value', () => {
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: 'foo',
                option: {
                    type: 'value',
                }
            },
        }, {});

        expect(change)
            .toMatchSnapshot();
    });

    it('should set value for select', () => {
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: 'bar',
                option: {
                    type: 'select',
                }
            },
        }, {});

        expect(change)
            .toMatchSnapshot();
    });

    it('should merge dicts', () => {
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
        }, {
            some: {
                path: {
                    description: 'foo',
                    value: 'bar',
                }
            }
        });

        expect(change)
            .toMatchSnapshot();
    });

    it('should apply mutations to lists', () => {
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
        }, {
            some: {
                path: ['one', 'bar', 'one', 'foo',],
            }
        });

        expect(change)
            .toMatchSnapshot();
    });

    it('should apply mutations to lists with duplicates', () => {
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: {
                    added: ['foo'],
                    removed: ['bar'],
                },
                option: {
                    type: 'list',
                    multiple: true,
                }
            },
        }, {
            some: {
                path: ['one', 'bar', 'two', 'foo',],
            }
        });

        expect(change)
            .toMatchSnapshot();
    });

    it('should undo canceled changes', () => {
        const change = ComputeChange({
            'id_1': {
                path: 'some.path',
                value: undefined,
                option: {
                    type: 'value',
                }
            },
            'id_2': {
                path: 'other.path',
                value: undefined,
                option: {
                    type: 'value',
                }
            },
        }, {
            some: {
                path: "Canceled value",
            },
            other: undefined,
        });

        expect(change)
            .toMatchSnapshot();
    });

    it('complain about unknown option type', () => {
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