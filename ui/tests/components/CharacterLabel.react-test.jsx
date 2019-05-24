import React from 'react';
import { CharacterLabel } from 'components/CharacterLabel.jsx';
import renderer from 'react-test-renderer';
import _ from 'lodash';

const { alignments, genders } = require('../__mocks__/apiCalls.js');
const character = {
    id: 1,
    name: 'Example',
    race: 'Orc',
    'class': 'Fighter',
    background: 'Noble',
    gender: "male",
    alignment: "lawful good",
    level: 1,
    xp_progress: 50,
    xp_level: 300,
};
const acp_character = {
    id: 1,
    name: 'Example',
    race: 'Orc',
    'class': 'Fighter',
    background: 'Noble',
    gender: "female",
    alignment: "lawful good",
    level: 5,
    adventure_checkpoints: 20,
    acp_progress: 4,
    acp_level: 8,
};

describe('Component: CharacterLabel', () => {
    it('should render with minimum props', () => {
        const tree = renderer.create(
            <CharacterLabel
                character_id={ 1 }
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show without progress', () => {
        const tree = renderer.create(
            <CharacterLabel
                character_id={ 1 }
                character={ character }
                alignments={ alignments }
                genders={ genders }
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show progress with level', () => {
        const tree = renderer.create(
            <CharacterLabel
                character_id={ 1 }
                character={ character }
                showProgress={ true }
                alignments={ alignments }
                genders={ genders }
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show progress with xp / max', () => {
        const tree = renderer.create(
            <CharacterLabel
                character_id={ 1 }
                character={
                    _.assign({}, character, {xp_progress: 299 })
                }
                showProgress={ true }
                alignments={ alignments }
                genders={ genders }
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show progress with acp', () => {
        const tree = renderer.create(
            <CharacterLabel
                character_id={ 1 }
                character={ acp_character }
                showProgress={ true }
                alignments={ alignments }
                genders={ genders }
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show modified char', () => {
        const tree = renderer.create(
            <CharacterLabel
                character_id={ 1 }
                character={ character }
                characterUpdate={ acp_character }
                showProgress={ true }
                alignments={ alignments }
                genders={ genders }
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
