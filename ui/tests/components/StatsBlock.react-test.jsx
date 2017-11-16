import React from 'react';
import _ from 'lodash';
import renderer from 'react-test-renderer';

import {StatsBlock} from '../../src/jsx/components/StatsBlock.jsx';

describe('Component: StatsBlock', () => {
    const props = _.reduce(
        [
            'strength', 'dexterity', 'constitution',
            'intelligence', 'wisdom', 'charisma'
        ], (stats, stat) => {
            stats['statistics'].push({
                name: stat, label: stat, description: stat
            });
            stats['bare'][stat] = 12;
            stats['bonus'][stat] = [1, 2];
            stats['base'][stat] = 12;
            stats['modifiers'] = -1;
            return stats;
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
            <StatsBlock {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
