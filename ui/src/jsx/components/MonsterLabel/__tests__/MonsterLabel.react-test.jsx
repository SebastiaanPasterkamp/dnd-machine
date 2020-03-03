import React from 'react';
import renderer from 'react-test-renderer';

import { MonsterLabel } from '../MonsterLabel';

describe('MonsterLabel', () => {
    const fullProps = {
        id: 1,
        showName: true,
        showRating: true,
        showType: true,
        showCampaign: true,
        size_hit_dice: [
            { id: "tiny", dice_size: 4, name: "Tiny" },
            { id: "small", dice_size: 6, name: "Small" },
        ],
        monster_types: [
            { id: "Aberration", name: "Aberration", description: "Aberration", intelligent: false },
            { id: "Beast", name: "Beast", description: "Beast", intelligent: false },
        ],
        alignments: [
            { id: "unaligned", name: "Unaligned" },
            { id: "lawful good", name: "Lawful good" },
        ],
        monster: {
            id: 1,
            name: "Wolf",
            campaign_id: 2,
            challenge_rating: 0.25,
            xp: 10,
            size: 'medium',
            type: 'beast',
            alignment: 'unaligned',
        },
    };

    describe('rendering', () => {
        it('should work with minimum props', () => {
            const tree = renderer.create(
                <MonsterLabel id={1} />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with full props', () => {
            const tree = renderer.create(
                <MonsterLabel
                    {...fullProps}
                />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work without any fields shown', () => {
            const tree = renderer.create(
                <MonsterLabel
                    {...fullProps}
                    showName={false}
                    showRating={false}
                    showType={false}
                    showCampaign={false}
                />
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
