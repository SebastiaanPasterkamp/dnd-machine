import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../../BaseLinkGroup';
import MonsterLabel from '../../MonsterLabel';


class MonsterRow extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.onPick = this.onPick.bind(this);
    }

    onPick() {
        const { item: { id }, onPick } = this.props;
        onPick(id);
    }

    render() {
        const {
            item: monster,
            label,
            icon,
            currentPick,
        } = this.props;

        return (
            <div className="monster-picker__row">
                <MonsterLabel
                    monster_id={monster.id}
                    monster={monster}
                    showType={true}
                    showRating={true}
                />
                <div className="actions">
                    <BaseLinkGroup>
                        <BaseLinkButton
                            label={label}
                            icon={icon}
                            className={monster.id === currentPick
                                ? "accent"
                                : null
                            }
                            action={this.onPick}
                        />
                    </BaseLinkGroup>
                </div>
            </div>
        );
    }
}

MonsterRow.propTypes = {
    onPick: PropTypes.func.isRequired,
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }),
    currentPick: PropTypes.number,
    label: PropTypes.string,
    icon: PropTypes.string,
};

MonsterRow.defaultProps = {
    item: {},
    currentPick: null,
    label: "Pick",
    icon: "paw",
};

export default MonsterRow;
