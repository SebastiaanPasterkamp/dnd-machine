import {
    isEqual,
    isObject,
    isPlainObject,
    keys,
    map,
    reduce,
    replace,
    zip,
} from 'lodash/fp';

import utils from '../../../utils';

export default function ComputeConfig(config, character, previous) {
    if (isPlainObject(config)) {
        const newConfig = reduce(
            (newConfig, key) => {
                newConfig[key] = config[key];

                if (!key.match(/_formula$/)) {
                    const newValue = ComputeConfig(config[key], character, (previous || {})[key]);
                    if (isEqual(config[key], newValue)) {
                        newConfig[key] = config[key];
                    } else if (previous && isEqual(previous[key], newValue)) {
                        newConfig[key] = previous[key];
                    } else {
                        newConfig[key] = newValue;
                    }
                    return newConfig;
                }

                const root = replace(/_formula$/, '', key);
                let newValue = undefined;
                try {
                    newValue = utils.resolveMath(
                        character,
                        config[key],
                        'character'
                    );
                } catch(error) {
                    console.error(error);
                    newValue = undefined;
                }
                if (newValue === undefined) {
                    newValue = config[`${root}_default`];
                }

                if (isEqual(config[root], newValue)) {
                    newConfig[root] = config[root];
                } else if (previous && isEqual(previous[root], newValue)) {
                    newConfig[root] = previous[root];
                } else {
                    newConfig[root] = newValue;
                }

                return newConfig;
            },
            {}
        )(keys(config));

        if (isEqual(newConfig, config)) {
            return config;
        }
        if (isEqual(newConfig, previous)) {
            return previous;
        }

        return newConfig;
    }

    if (isObject(config)) {
        const newConfig = map(([value, previousValue]) => {
            const newValue = ComputeConfig(value, character, previousValue);

            if (isEqual(value, newValue)) {
                return value;
            }
            if (isEqual(previousValue, newValue)) {
                return previousValue;
            }

            return newValue;
        })(zip(config, previous));

        if (isEqual(newConfig, config)) {
            return config;
        }
        if (isEqual(newConfig, previous)) {
            return previous;
        }

        return newConfig;
    }

    return config;
};
