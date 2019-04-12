import React from 'react';
import { mount } from 'enzyme';

import { AdventureLeagueLogEdit } from '../AdventureLeagueLogEdit';

import { xp, acp } from './__mocks__/AdventureLeagueLogEdit.props.json';

describe('AdventureLeagueLogEdit', () => {

    describe('should render', () => {
        const setState = jest.fn();

        it('with minimum props', () => {
            const wrapped = mount(
                <AdventureLeagueLogEdit
                    setState={setState}
                />
            );

            expect(wrapped).toMatchSnapshot();
        });

        describe('with full XP props', () => {
            it('before being consumed', () => {
                const wrapped = mount(
                    <AdventureLeagueLogEdit
                        setState={setState}
                        {...xp}
                        character_snapshot={null}
                    />
                );

                expect(wrapped).toMatchSnapshot();
            });

            it('after being consumed', () => {
                const wrapped = mount(
                    <AdventureLeagueLogEdit
                        setState={setState}
                        {...xp}
                        consumed={true}
                    />
                );

                expect(wrapped).toMatchSnapshot();
            });
        });

        describe('with full ACP props', () => {
            it('before being consumed', () => {
                const wrapped = mount(
                    <AdventureLeagueLogEdit
                        setState={setState}
                        {...acp}
                        character_snapshot={null}
                    />
                );

                expect(wrapped).toMatchSnapshot();
            });

            it('after being consumed', () => {
                const wrapped = mount(
                    <AdventureLeagueLogEdit
                        setState={setState}
                        {...acp}
                        consumed={true}
                    />
                );

                expect(wrapped).toMatchSnapshot();
            });
        });
    });

    describe('should handle changing', () => {
        const setState = jest.fn();
        const wrapped = mount(
            <AdventureLeagueLogEdit
                setState={setState}
            />
        );

        beforeEach(() => setState.mockClear());

        it('the session', () => {
            wrapped
                .find('.al-log-edit__session input[data-field="name"]')
                .simulate('change', {target: {
                    value: xp.adventure.name,
                }});

            expect(setState).toBeCalledWith({
                adventure: {
                    name: xp.adventure.name,
                }
            });
        });

        it('the gold', () => {
            wrapped
                .find('.al-log-edit__gold button')
                .simulate('click');
            wrapped
                .find('.al-log-edit__gold li[data-value="cp"] a')
                .simulate('click');

            expect(setState).toBeCalledWith({
                gold: {
                    starting: {},
                    earned: {
                        cp: 1,
                    },
                    total: {
                        cp: 1,
                    },
                }
            });
        });

        it('the renown', () => {
            wrapped
                .find('.al-log-edit__renown input[data-field="earned"]')
                .simulate('change', {target: {
                    value: '1+1',
                }});

            expect(setState).toBeCalledWith({
                renown: {
                    starting: 0,
                    earned: 2,
                    total: 2,
                }
            });
        });

        it('the downtime', () => {
            wrapped
                .find('.al-log-edit__downtime input[data-field="earned"]')
                .simulate('change', {target: {
                    value: '5',
                }});

            expect(setState).toBeCalledWith({
                downtime: {
                    starting: 0,
                    earned: 5,
                    total: 5,
                }
            });
        });

        it('the note', () => {
            wrapped
                .find('.al-log-edit__notes textarea')
                .simulate('change', {target: {
                    value: 'Hello world',
                }});

            expect(setState).toBeCalledWith({
                notes: 'Hello world',
            });
        });

        it('the xp', () => {
            wrapped
                .find('.al-log-edit__xp input[data-field="earned"]')
                .simulate('change', {target: {
                    value: '25+100',
                }});

            expect(setState).toBeCalledWith({
                xp: {
                    starting: 0,
                    earned: 125,
                    total: 125,
                }
            });
        });

        it('from xp to acp', () => {
            wrapped
                .find('#acp-switch')
                .simulate('change');

            expect(setState).not.toBeCalled();
        });

        it('the progression pace', () => {
            wrapped
                .find('#acp-slow-progress')
                .simulate('change');

            expect(setState).toBeCalledWith({
                slow_progress: true,
            });
        });

        it('the acp', () => {
            wrapped
                .find('.al-log-edit__acp input[data-field="earned"]')
                .simulate('change', {target: {
                    value: '5',
                }});

            expect(setState).toBeCalledWith({
                adventure_checkpoints: {
                    starting: 0,
                    earned: 5,
                    total: 5,
                }
            });
        });

        it('the tcp', () => {
            wrapped
                .find('.al-log-edit__treasure input[data-field="tier-one"]')
                .simulate('change', {target: {
                    value: '5',
                }});

            expect(setState).toBeCalledWith({
                treasure_checkpoints: {
                    starting: {},
                    earned: {
                        one: 5,
                        two: 0,
                        three: 0,
                        four: 0,
                    },
                    total: {
                        one: 5,
                        two: 0,
                        three: 0,
                        four: 0,
                    },
                }
            });
        });
    });
});