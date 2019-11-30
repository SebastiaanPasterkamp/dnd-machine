import React from 'react';
import PropTypes from 'prop-types';

import ChallengeRating from '../../../components/ChallengeRating';
import Panel from '../../../components/Panel';
import XpRating from '../../../components/XpRating';

import EncounterRating from './EncounterRating';

export const ChallengePanel = function( {
    modifier, hosted_party,
    challenge_rating, challenge_modified, challenge_rating_precise,
    xp, xp_modified, xp_rating,
} ) {
    return (
        <Panel
            key="challenge"
            className="encounter-edit__challenge"
            header="Challenge Rating Overview"
        >
            <tbody>
                <tr>
                    <th>Monster Modifier</th>
                    <th>Party Modifier</th>
                    <th>Final Modifier</th>
                </tr>
                <tr>
                    <td>{modifier.monster}</td>
                    <td>{modifier.party}</td>
                    <td>{modifier.total}</td>
                </tr>
                <tr>
                    <th>Challenge Rating</th>
                    <th>Modified for party</th>
                    <th>Exact Challenge Rating</th>
                </tr>
                <tr>
                    <td>
                        <ChallengeRating
                            challengeRating={challenge_rating}
                        />
                        &nbsp;/&nbsp;
                        <XpRating
                            xpRating={xp}
                        />
                    </td>
                    {hosted_party && hosted_party.size ? (
                        <td>
                            <ChallengeRating
                                challengeRating={challenge_modified}
                            />
                            &nbsp;/&nbsp;
                            <XpRating
                                xpRating={xp_modified}
                            />
                        </td>
                    ) : (
                        <td>&mdash;</td>
                    )}
                    <td>
                        <ChallengeRating
                            challengeRating={challenge_rating_precise}
                            precise={true}
                        />
                        &nbsp;/&nbsp;
                        <XpRating
                            xpRating={xp_rating}
                            precise={true}
                        />
                    </td>
                </tr>
                {hosted_party && hosted_party.size ? (
                    <React.Fragment>
                        <tr>
                            <th>Party Size</th>
                            <th>XP / Party Member</th>
                            <th>Challenge Classification</th>
                        </tr>
                        <tr>
                            <td>{hosted_party.size}</td>
                            <td>
                                <XpRating
                                    xpRating={xp / hosted_party.size}
                                />
                            </td>
                            <td>
                                <EncounterRating
                                    encounter={xp_rating}
                                    party={hosted_party.challenge}
                                />
                            </td>
                        </tr>
                    </React.Fragment>
                ) : null}
            </tbody>
        </Panel>
    );
}

ChallengePanel.propTypes = {
    modifier: PropTypes.shape({
        monster: PropTypes.number.isRequired,
        party: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }),
    challenge_rating: PropTypes.number,
    challenge_modified: PropTypes.number,
    challenge_rating_precise: PropTypes.number,
    xp: PropTypes.number,
    xp_modified: PropTypes.number,
    xp_rating: PropTypes.number,
    hosted_party: PropTypes.shape({
        id: PropTypes.number,
        size: PropTypes.number.isRequired,
        challenge: PropTypes.shape({
            easy: PropTypes.number.isRequired,
            medium: PropTypes.number.isRequired,
            hard: PropTypes.number.isRequired,
            deadly: PropTypes.number.isRequired,
        }),
    }),
};

ChallengePanel.defaultProps = {
    modifier: {
        monster: 1.0,
        party: 1.0,
        total: 1.0,
    },
    challenge_rating: 0,
    challenge_modified: 0,
    challenge_rating_precise: 0,
    xp: 0,
    xp_modified: 0,
    xp_rating: 0,
    hosted_party: null,
};

export default ChallengePanel;
