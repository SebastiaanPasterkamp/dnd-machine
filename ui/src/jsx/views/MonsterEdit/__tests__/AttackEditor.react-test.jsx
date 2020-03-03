import React from 'react';
import {mount} from 'enzyme';
import renderer from 'react-test-renderer';

import {mockedApi, attack_modes, damage_types, target_methods} from '../../../../../tests/__mocks__';

import AttackEditor from '../components/AttackEditor';

describe('AttackEditor', () => {
    const fullProps = {
        name: 'Punch',
        description: 'Fist to Face',
        damage: [
            {
                dice_count: 1,
                dice_size: 4,
                bonus: 1,
                type: 'bludgeoning'
            }
        ],
        target: 'single',
        mode: 'melee',
        reach: {
            min: 5,
            max: 5
        },
        on_hit: "It hurts",
        on_mis: "It doesn't hurt"
    };

    beforeAll(() => {
        fetch.mockImplementation(mockedApi({
            attack_modes,
            damage_types,
            target_methods,
        }));
    });

    afterAll(() => {
        fetch.resetMocks();
    });

    it('should render without props', () => {
        const setState = jest.fn();
        const tree = renderer.create(<AttackEditor setState={setState}/>);

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const setState = jest.fn();

        const tree = renderer.create(<AttackEditor {...fullProps} setState={setState}/>);

        expect(tree).toMatchSnapshot();
    });

    describe('while editing', () => {
        const setState = jest.fn();
        let wrapper;

        beforeAll(() => {
            wrapper = mount(<AttackEditor setState={setState}/>);
        });

        it('should accept a name change', () => {
            wrapper.find('input[data-field="name"]').simulate('change', {
                target: {
                    value: fullProps.name
                }
            });

            expect(setState).toBeCalledWith({
                name: fullProps.name
            }, null)
        });

        it('should accept a target change', () => {
            wrapper.find('button').at(0).simulate('click');
            wrapper.find('li[data-value="area"]').simulate('click');

            expect(setState).toBeCalledWith({
                target: 'area'
            }, null)
        });
    });
});
