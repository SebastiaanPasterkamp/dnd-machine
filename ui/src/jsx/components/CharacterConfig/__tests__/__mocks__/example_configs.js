export const value = {
    type: 'value',
    uuid: 'mocked-uuid-1',
    path: 'foo.value',
    value: 'bar',
};

export const dict = {
    type: 'dict',
    uuid: 'mocked-uuid-2',
    path: 'foo.dict',
    dict: {
        description: 'foo %(bar)s',
        bar: 'blah',
    }
};

export const ability_score = {
    type: 'ability_score',
    uuid: 'mocked-uuid-15',
    limit: 2,
};

export const choice = {
    type: 'choice',
    uuid: 'mocked-uuid-8',
    options: [{
        type: 'config',
        uuid: 'mocked-uuid-9',
        label: 'a',
        description: 'foo',
        config: [
            {
                type: 'value',
                uuid: 'mocked-uuid-16',
                path: 'bar.value',
                value: 'Choice A',
            }
        ],
    }, {
        type: 'config',
        uuid: 'mocked-uuid-10',
        label: 'b',
        config: [
            {
                type: 'value',
                uuid: 'mocked-uuid-17',
                path: 'bar.value',
                value: 'Choice B',
            }
        ],
    }],
};

export const config = {
    type: 'config',
    uuid: 'mocked-uuid-7',
    config: [
        {
            type: 'value',
            uuid: 'mocked-uuid-18',
            path: 'config.value',
            value: 'Nested config',
        }
    ],
};

export const list = {
    type: 'list',
    uuid: 'mocked-uuid-4',
    list: ['statistics'],
    path: 'foo.list',
    given: ['wisdom'],
    replace: 1,
    add: 2,
};

export const list_array = {
    type: 'list',
    uuid: 'mocked-uuid-5',
    items: ['foo', 'bar'],
    path: 'foo.empty',
    given: ['bar'],
    add: 1,
};

export const list_object = {
    type: 'list',
    uuid: 'mocked-uuid-6',
    list: ['statistics'],
    path: 'foo.items',
    objectlist: true,
    given: [
        {id: 'ruh', type: 'statistics', name: 'Ruh' },
    ],
    add: 1,
};

export const manual = {
    type: 'manual',
    uuid: 'mocked-uuid-14',
    placeholder: 'Think of something',
    markup: true,
};

export const multichoice = {
    type: 'multichoice',
    uuid: 'mocked-uuid-11',
    options: [{
        type: 'value',
        uuid: 'mocked-uuid-12',
        path: 'multichoice.value',
        label: 'a',
        description: 'foo',
        value: 'Multi choice option A',
    }, {
        type: 'value',
        uuid: 'mocked-uuid-13',
        path: 'multichoice.value',
        label: 'b',
        description: 'bar',
        value: 'Multi choice option B',
    }],
    add: 1,
};

export const select = {
    type: 'select',
    uuid: 'mocked-uuid-3',
    list: ['statistics'],
    path: 'foo.select',
};

export const statistics = {
    type: 'statistics',
    uuid: 'mock-uuid-stats-16',
    editBase: true,
};
