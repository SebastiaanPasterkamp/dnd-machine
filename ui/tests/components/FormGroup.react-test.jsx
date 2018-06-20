import React from 'react';
import FormGroup from 'components/FormGroup.jsx';
import renderer from 'react-test-renderer';

describe('Component: FormGroup', () => {
    it('should render', () => {
        const tree = renderer.create(
            <FormGroup label="test">
                Foo bar
            </FormGroup>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
