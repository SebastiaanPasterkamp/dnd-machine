import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { mockedApi } from '../../../../../tests/__mocks__';

import Spells from '../components/Spells';

describe('Spells', () => {
    const fullProps = {
        spell: {
            list: [
                "Minor Illusion",
            ],
            prepared: [

            ],
            level: {
                cantrip: [
                    {
                        casting_time: "1 action",
                        components: [ "somatic" ],
                        concentration: false,
                        description: "You create a sound or an image.",
                        duration: "1 minute",
                        id: 1,
                        level: "Cantrip",
                        name: "Minor Illusion",
                        range: "30 feet",
                        school: "illusion",
                    },
                ],
                "level_1": [
                    {
                        casting_time: "1 action",
                        components: [ "verbal" ],
                        concentration: false,
                        description: "You whisper a discordant melody.",
                        duration: "Instantaneous",
                        id: 2,
                        level: "1",
                        name: "Dissonant Whispers",
                        range: "60 feet",
                        school: "enchantment"
                    },
                ],
            },
        },
    };

    beforeEach(() => {
        fetch.mockImplementation( mockedApi({
            magic_components: [
                {
                    code: "somatic",
                    label: "Somatic",
                    short: "S",
                    description: "Gestures",
                },
                {
                    code: "verbal",
                    label: "Verbal",
                    short: "V",
                    description: "Spoken",
                },
            ],
            magic_schools: [
                {
                    code: "enchantment",
                    label: "Enchantment",
                    description: "Magically entrance people.",
                },
                {
                    code: "illusion",
                    label: "Illusion",
                    description: "Magic that dazzles the senses.",
                },
            ],
        }) );
    })

    afterEach(() => {
        fetch.resetMocks()
    })

    it('should render without props', () => {
        const tree = renderer.create(
            <Spells />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(
            <Spells {...fullProps} />
        );

        expect(tree).toMatchSnapshot();
    });
});
