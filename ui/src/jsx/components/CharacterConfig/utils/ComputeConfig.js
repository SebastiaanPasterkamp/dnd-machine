import {
    isEqual,
    isObject,
    isPlainObject,
    keys,
    map,
    reduce,
    replace,
} from 'lodash/fp';

import utils from '../../../utils';

export default function ComputeConfig(config, character) {
    if (isPlainObject(config)) {
        let changed = false;
        const newConfig = reduce(
            (newConfig, key) => {
                newConfig[key] = config[key];
                if (key.match(/_formula$/)) {
                    const root = replace(/_formula$/, '', key);
                    newConfig[root] = config[root];
                    let newValue = undefined;
                    try {
                        newValue = utils.resolveMath(
                            character,
                            config[key],
                            'character'
                        );
                    } catch(error) {
                        newValue = undefined;
                    }
                    if (newValue === undefined) {
                        newValue = config[`${root}_default`];
                    }
                    if (!isEqual(newValue, newConfig[root])) {
                        changed = true;
                        newConfig[root] = newValue;
                    }
                } else {
                    const newValue = ComputeConfig(
                        config[key],
                        character
                    );
                    if (newValue !== newConfig[key]) {
                        changed = true;
                        newConfig[key] = newValue;
                    }
                }
                return newConfig;
            },
            {}
        )(keys(config));
        if (changed) {
            return newConfig;
        }
    } else if (isObject(config)) {
        let changed = false;
        const newConfig = map((value) => {
            const newValue = ComputeConfig(value, character);
            if (newValue !== value) {
                changed = true;
                return newValue;
            }
            return value;
        })(config);
        if (changed) {
            return newConfig;
        }
    }
    return config;
};
