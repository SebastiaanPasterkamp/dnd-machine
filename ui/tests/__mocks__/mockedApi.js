import {
    assign,
    keys,
    reduce,
} from 'lodash/fp';

const addApiResponse = function (responses) {
    if (!('mock' in fetch && 'responses' in fetch.mock)) {
        fetch.mock.responses = {};
    }
    fetch.mock.responses = assign(
        fetch.mock.responses,
        responses
    );
}

const mockedApi = function (responses = {}) {
    fetch.mock.responses = {};
    addApiResponse(responses);

    return (request) => {
        const response = reduce(
            (promise, pattern) => {
                if (request.match(pattern)) {
                    return fetch.mock.responses[pattern];
                }
                return promise;
            },
            undefined
        )(keys(fetch.mock.responses));

        return new Promise(
            (resolve, reject) => response !== undefined
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
    addApiResponse,
    mockedApi,
};
