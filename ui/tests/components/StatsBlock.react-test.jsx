import React from 'react';
import _ from 'lodash';
import renderer from 'react-test-renderer';

import {StatsBlock} from '../../src/jsx/components/StatsBlock.jsx';

describe('Component: StatsBlock', () => {
    const props = _.reduce(
        [
            'strength', 'dexterity', 'constitution',
            'intelligence', 'wisdom', 'charisma'
        ], (props, stat) => {
            props.statistics.push({
                id: stat,
                name: stat,
                description: stat
            });
            props.bare[stat] = 12;
            props.bonus[stat] = [1, 2];
            props.base[stat] = 12;
            props.modifiers[stat] = -1;
            return props;
        },
        {
            statistics: [],
            bare: {},
            bonus: {},
            base: {},
            modifiers: {}
        }
    );

    it('should show stat block editor', () => {
        const tree = renderer.create(
            <StatsBlock
                {...props}
                maxBare={15}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
