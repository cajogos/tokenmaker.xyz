declare type APIError = {
    errorCode: number,
    errorMessage: string
};

declare type ValidResult = {
    input: object,
    output: object
};

declare type ExpectedResponse = {
    success: boolean,
    result?: ValidResult
    error?: APIError
};
