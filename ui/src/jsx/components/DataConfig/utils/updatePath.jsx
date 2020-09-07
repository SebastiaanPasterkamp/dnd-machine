import {
    startCase,
    camelCase,
    isArray,
    isObject,
    isString,
    keys,
    lowerCase,
    map,
    zipObject,
} from 'lodash/fp';

export function updatePath(from, to, data) {
    const camelCaseFrom = subPathRegExp(toCamelCase(from));
    const camelCaseTo = `$1${toCamelCase(to)}$2`;
    const dotCaseFrom = subPathRegExp(toDotCase(from));
    const dotCaseTo = `$1${toDotCase(to)}$2`;
    const startCaseFrom = subPathRegExp(toStartCase(from));
    const startCaseTo = `$1${toStartCase(to)}$2`;

    const inFormulaFrom = subFormulaRegExp(toDotCase(from));
    const inFormulaTo = `$1${toDotCase(to)}$2`;

    function update(subject) {
        if (isArray(subject)) {
            return map(
                item => update(item)
            )(subject);
        }
        if (isObject(subject)) {
            return zipObject(
                keys(subject),
                map(
                    value => update(value)
                )(subject)
            );
        }
        if (!isString(subject)) {
            return subject;
        }
        subject = subject.replace(camelCaseFrom, camelCaseTo);
        subject = subject.replace(dotCaseFrom, dotCaseTo);
        subject = subject.replace(startCaseFrom, startCaseTo);

        subject = subject.replace(inFormulaTo, inFormulaTo);
        return subject;
    };

    return update(data);
};

/**
 * Change a list of tokens into a camelCase strings
 */
export function toCamelCase(tokens) {
    return camelCase(
        normalized(tokens).join(' ')
    ).replace(' ', '');
};

/**
 * Change a list of tokens into a StartCase strings
 */
export function toStartCase(tokens) {
    return startCase(
        normalized(tokens).join(' ')
    ).replace(' ', '');
};

/**
 * Change a list of tokens into a dot.case strings
 */
export function toDotCase(tokens) {
    return normalized(tokens).join('.');
};

/**
 * Normalizes list of tokens to be
 * * lower cased
 * * without spaces
 */
function normalized(tokens) {
    return map(
        token => lowerCase(token).replace(/[^a-z0-9]+/gi, '')
    )(tokens);
}

/**
 * Turns a string into a regexp that matches
 * the string as part of a path string.
 */
function subPathRegExp(path) {
    return new RegExp(
        `^(.*?[\.a-z0-9])?(?:${path.replace('.', '\\.')})((?!\\.\\.)[.A-Z].*)?$`
    );
}

/**
 * Turns a string into a regexp that matches
 * the string as part of a formula.
 */
function subFormulaRegExp(path) {
    return new RegExp(
        `^(.*?[^.a-zA-Z0-9])?(?:${path.replace('.', '\\.')})([^.a-zA-Z0-9].*)?$`
    );
}
