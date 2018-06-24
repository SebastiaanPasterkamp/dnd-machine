import _ from 'lodash';
import math from 'mathjs';

const utils = {
    randomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    makeStyle(conditionals, styles=[]) {
        const active = _.filter(
            _.reduce(
                conditionals,
                (active, use, style) => {
                    if (use) {
                        active.push(style);
                    }
                    return active;
                },
                styles
            )
        );
        if (!active.length) {
            return null;
        }
        return _.join(active, ' ');
    },

    closest(options, target, defaultOption=null) {
        let matched = _.reduce(
            options,
            (match, value, option) => {
                let delta = Math.abs(value - target);
                if (delta < match.delta) {
                    match = {delta, option};
                }
                return match;
            },
            {option: defaultOption, delta: Number.MAX_SAFE_INTEGER}
        );
        return matched.option;
    },

    resolveMath(obj, formula, name='') {
        let replace = {};
        const re = new RegExp(/\b[a-z_.]+\b/);
        const prefix = new RegExp(`^${name}\.`);

        const matches = re.exec(formula);
        _.forEach(matches, match => {
            const path = match.replace(prefix, '')
            const value = _.get(obj, path);
            if (
                value !== undefined
                || path !== match
            ) {
                replace[match] = value;
            }
        });
        _.forEach(replace, (replace, match) => {
            formula = formula.replace(match, replace);
        });
        return math.eval(formula);
    }
};

export function userHasRole(user, role) {
    const roles = _.isArray(role) ? role : [role];
    return (
        _.intersection(
            user.role || [],
            roles
        ).length > 0
    );
};

export default utils;
