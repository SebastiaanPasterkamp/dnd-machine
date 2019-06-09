import _ from 'lodash';
import core from 'mathjs/core';
const math = core.create();
math.import(require('mathjs/lib/expression/function/eval'));

// create simple functions for all operators
math.import({
    // arithmetic
    add:        function (a, b) { return a + b },
    subtract:   function (a, b) { return a - b },
    multiply:   function (a, b) { return a * b },
    divide:     function (a, b) { return a / b },
    mod:        function (a, b) { return a % b },
    unaryPlus:  function (a) { return  a },
    unaryMinus: function (a) { return -a },

    // bitwise
    bitOr:           function (a, b) { return a | b },
    bitXor:          function (a, b) { return a ^ b },
    bitAnd:          function (a, b) { return a & b },
    bitNot:          function (a) { return ~a },
    leftShift:       function (a, b) { return a << b },
    rightArithShift: function (a, b) { return a >> b },
    rightLogShift:   function (a, b) { return a >>> b },

    // logical
    or:  function (a, b) { return !!(a || b) },
    xor: function (a, b) { return !!a !== !!b },
    and: function (a, b) { return !!(a && b) },
    not: function (a) { return !a },

    // relational
    equal:     function (a, b) { return a == b },
    unequal:   function (a, b) { return a != b },
    smaller:   function (a, b) { return a < b },
    larger:    function (a, b) { return a > b },
    smallerEq: function (a, b) { return a <= b },
    largerEq:  function (a, b) { return a >= b },
    pi: Math.PI,
    e: Math.E,
    'true': true,
    'false': false,
    'null': null,
});

var allFromMath = {};
Object.getOwnPropertyNames(Math).forEach(function (name) {
    if (!Object.prototype.hasOwnProperty(name)) {
        allFromMath[name] = Math[name];
    }
});
math.import(allFromMath);

const styleCache = {
    '': null,
};

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
        const style = _.join(active, ' ');
        if (styleCache[style] === undefined) {
            styleCache[style] = style;
        }
        return styleCache[style];
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
        const re = new RegExp(/\b[a-z_]+\.[a-z_.]+\b/g);
        const prefix = new RegExp(`^${name}\.`);

        _.forEach(formula.match(re), match => {
            const path = _.replace(match, prefix, '');
            const value = _.get(obj, path);
            if (value !== undefined
                || path !== match
            ) {
                replace[match] = JSON.stringify(value);
            }
        });

        _.forEach(replace, (replace, match) => {
            formula = _.replace(formula, match, replace);
        });

        try {
            const result = math.eval(formula);
            if (result.toArray !== undefined) {
                return result.toArray();
            }
            return result;
        } catch(err) {
            return undefined;
        }
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

export function memoize(name, callback) {
    if (!('_memoize' in this)) {
        this._memoize = {};
    }
    if (!(name in this._memoize)) {
        this._memoize[name] = callback;
    }
    return this._memoize[name];
}

export default utils;
