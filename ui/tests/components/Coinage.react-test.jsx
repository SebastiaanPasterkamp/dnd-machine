import React from 'react';
import Coinage from '../../src/jsx/components/Coinage.jsx';
import renderer from 'react-test-renderer';

describe('Component: Coinage', () => {
    it('should show simple gold price', () => {
        const props = {gp: 10};
        const tree = renderer.create(
            <Coinage {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show a human readable gold price', () => {
        const props = {gp: 10, extended: true};
        const tree = renderer.create(
            <Coinage {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show an ordered list of coins', () => {
        const props = {pp: 1, cp: 5, gp: 2, sp: 4, ep: 3};
        const tree = renderer.create(
            <Coinage {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show an ordered list of human readable coins', () => {
        const props = {pp: 1, cp: 5, gp: 2, sp: 4, ep: 3, extended: true};
        const tree = renderer.create(
            <Coinage {...props} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
