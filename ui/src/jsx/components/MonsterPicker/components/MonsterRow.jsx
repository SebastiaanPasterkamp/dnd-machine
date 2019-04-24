import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../../BaseLinkGroup/index.jsx';
import MonsterLabel from '../../MonsterLabel.jsx';


class MonsterRow extends React.PureComponent
{
    onPick = () => {
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
