import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import ModalDialog from 'components/ModalDialog.jsx';

describe('Component: ModalDialog', () => {
    it('should render with minimum props', () => {
        const tree = renderer.create(
            <MemoryRouter>
                <ModalDialog
                    label="test"
                >
                    Foo bar
                </ModalDialog>
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const mockFunc = jest.fn();
        const tree = renderer.create(
            <MemoryRouter>
                <ModalDialog
                    label="test"
                    subheading="more testing"
                    onCancel={ mockFunc }
                    cancelLabel="Close"
                    onDone={ mockFunc }
                    doneLabel="Save"
                    onHelp={ mockFunc }
                    helpLabel="Whut!"
                >
                    <span>
                        Foo bar
                    </span>
                </ModalDialog>
            </MemoryRouter>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should bind onCancel to close', () => {
        const onCancel = jest.fn();
        const wrapper = mount(
            <MemoryRouter>
                <ModalDialog
                    label="test"
                    subheading="more testing"
                    onCancel={ onCancel }
                >
                    <span>
                        Foo bar
                    </span>
                </ModalDialog>
            </MemoryRouter>
        );

        wrapper
            .find('.fa-times')
            .simulate('click');

        expect(onCancel)
            .toBeCalled();
    });

    it('should bind onCancel to cancel', () => {
        const onCancel = jest.fn();
        const wrapper = mount(
            <MemoryRouter>
                <ModalDialog
                    label="test"
                    subheading="more testing"
                    onCancel={ onCancel }
                >
                    <span>
                        Foo bar
                    </span>
                </ModalDialog>
            </MemoryRouter>
        );

        wrapper
            .find('a.cursor-pointer')
            .simulate('click');

        expect(onCancel)
            .toBeCalled();
    });

    it('should bind onDone', () => {
        const onDone = jest.fn();
        const wrapper = mount(
            <MemoryRouter>
                <ModalDialog
                    label="test"
                    onDone={ onDone }
                >
                    <span>
                        Foo bar
                    </span>
                </ModalDialog>
            </MemoryRouter>
        );

        wrapper
            .find('a.primary')
            .simulate('click');

        expect(onDone)
            .toBeCalled();
    });

    it('should bind onHelp', () => {
        const onHelp = jest.fn();
        const wrapper = mount(
            <MemoryRouter>
                <ModalDialog
                    label="test"
                    onHelp={ onHelp }
                >
                    <span>
                        Foo bar
                    </span>
                </ModalDialog>
            </MemoryRouter>
        );


        wrapper
            .find('.fa-question')
            .simulate('click');

        expect(onHelp)
            .toBeCalled();
    });
});
