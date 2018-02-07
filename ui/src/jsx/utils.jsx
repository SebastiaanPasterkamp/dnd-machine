import _ from 'lodash';

let utils = {
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

    closestStyle(styles, target, defaultStyle=null) {
        let matched = _.reduce(
            styles,
            (match, value, style) => {
                let delta = Math.abs(value - target);
                if (delta < match.delta) {
                    match = {delta, style};
                }
                return match;
            },
            {style: defaultStyle, delta: Number.MAX_SAFE_INTEGER}
        );
        return matched.style;
    }
}

export default utils;
