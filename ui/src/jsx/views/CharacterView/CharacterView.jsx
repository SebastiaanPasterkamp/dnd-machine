import React from 'react';

import './sass/_character-view.scss';

import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper.jsx';

import Abilities from './components/Abilities';
import Backstory from './components/Backstory';
import Basics from './components/Basics';
import Description from './components/Description';
import Equipment from './components/Equipment';
import Information from './components/Information';
import Personality from './components/Personality';
import Skills from './components/Skills';
import Spells from './components/Spells';
import Statistics from './components/Statistics';
import Traits from './components/Traits';

const viewConfig = {
    className: 'character-view',
    icon: 'fa-user-secret',
    label: 'Character'
};

const CharacterView = function(props) {
    const { race, 'class': _class, background } = props;
    if (!race || !_class || !background) {
        return null;
    }

    return (
        <React.Fragment>
            <Description {...props} />

            <Information {...props} />

            <Basics
                {...props}
                statistics={undefined}
            />

            <Equipment {...props} />

            <Skills
                {...props}
                skillBonus={props.skills}
                skills={undefined}
                statistics={undefined}
            />

            <Statistics
                {...props}
                stats={props.statistics}
                statistics={undefined}
            />

            <Backstory {...props} />

            <Personality {...props.personality} />

            <Spells {...props} />

            <Abilities {...props} />

            <Traits {...props} />
        </React.Fragment>
    );
}

export default RoutedObjectDataWrapper(
    CharacterView,
    viewConfig,
    "character",
);
