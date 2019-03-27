import PropTypes from 'prop-types';

const deltaType = PropTypes.shape({
    starting: PropTypes.number,
    earned: PropTypes.number,
    total: PropTypes.number,
});

const deltaDefault = {
    starting: 0,
    earned: 0,
    total: 0,
};

const tierType = PropTypes.shape({
    one: PropTypes.number,
    two: PropTypes.number,
    three: PropTypes.number,
    four: PropTypes.number,
});

const tierDefault = {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
};

export {
    deltaType,
    deltaDefault,
    tierType,
    tierDefault,
};