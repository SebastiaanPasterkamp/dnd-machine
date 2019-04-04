import React from 'react';
import CheckBox from 'components/CheckBox.jsx';
import renderer from 'react-test-renderer';

describe('Component: CheckBox', () => {
    it('should render without props', () => {
        const tree = renderer.create(
            <CheckBox
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render an empty box', () => {
        const tree = renderer.create(
            <CheckBox
                isChecked={false}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render ticked box', () => {
        const tree = renderer.create(
            <CheckBox
                isChecked={true}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
