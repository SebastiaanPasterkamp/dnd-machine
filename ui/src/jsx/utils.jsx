import {
    entries,
    filter,
    forEach,
    flow,
    get,
    intersection,
    isArray,
    keys,
    reduce,
    replace,
} from 'lodash/fp';
import { create } from 'mathjs'
const math = create();
// math.import(require('mathjs/lib/expression/function/eval'));

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
        const active = filter(
            null,
            reduce(
                (active, style) => {
                    if (conditionals[style]) {
                        active.push(style);
                    }
                    return active;
                },
                styles
            )(keys(conditionals))
        );
        const style = active.join(' ');
        if (styleCache[style] === undefined) {
            styleCache[style] = style;
        }
        return styleCache[style];
    },

    closest(options, target, defaultOption=null) {
        let matched = reduce(
            (match, option) => {
                const delta = Math.abs(options[option] - target);
                if (delta < match.delta) {
                    return { delta, option };
                }
                return match;
            },
            { option: defaultOption, delta: Number.MAX_SAFE_INTEGER }
        )(keys(options));
        return matched.option;
    },

    resolveMath(obj, formula, name='') {
        const replacings = {};
        const re = new RegExp(/\b[a-z_]+\.[a-z_.]+\b/g);
        const prefix = new RegExp(`^${name}\.`);

        forEach((match) => {
            const path = replace(prefix, '', match);
            const value = get(path, obj);
            if (value !== undefined || path !== match) {
                replacings[match] = JSON.stringify(value);
            }
        })(formula.match(re));

        flow(entries, forEach(([match, value]) => {
            formula = replace(match, value, formula);
        }))(replacings);

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
    const roles = isArray(role) ? role : [role];
    return (
        intersection(
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
