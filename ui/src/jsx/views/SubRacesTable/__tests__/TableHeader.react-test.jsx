import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import TableHeader from '../components/TableHeader';

describe('TableHeader', () => {

    it('should render', () => {
        const tree = renderer.create(
            <TableHeader />
        );

        expect(tree).toMatchSnapshot();
    });

});
