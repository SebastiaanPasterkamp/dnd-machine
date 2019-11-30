import React from 'react';
import renderer from 'react-test-renderer';

import { CampaignLabel } from '../CampaignLabel';

describe('CampaignLabel', () => {
    const fullProps = {
        id: 1,
        showTooltip: true,
        campaign: {
            id: 1,
            name: "Test",
            description: "Testing *this*",
            user_id: 1,
        },
    };

    describe('rendering', () => {
        it('should work with minimum props', () => {
            const tree = renderer.create(
                <CampaignLabel id={1} />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with full props', () => {
            const tree = renderer.create(
                <CampaignLabel
                    {...fullProps}
                />
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work without tooltip', () => {
            const tree = renderer.create(
                <CampaignLabel
                    {...fullProps}
                    showTooltip={false}
                />
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
