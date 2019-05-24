import {
    keys,
    reduce,
} from 'lodash/fp';

const mockedApi = function (responses) {
    return (request) => {
        const response = reduce(
            (promise, pattern) => {
                if (request.match(pattern)) {
                    return responses[pattern];
                }
                return promise;
            },
            null
        )(keys(responses));

        return new Promise(
            (resolve, reject) => response
                ? resolve({
                    ok: true,
                    json: () => new Promise(
                        (resolve, reject) => resolve(response)
                    )
                })
                : reject(request)
        );
    };
};

export {
    mockedApi,
};
