declare type APIError = {
    errorCode: number,
    errorMessage: string
};

declare type ValidResult = {
    input: object,
    output: {
        compiled: {
            contracts: {
                [globalName: string]: CompiledContract
            }
        }
    }
};

declare type ExpectedResponse = {
    success: boolean,
    result?: ValidResult
    error?: APIError
};

declare type CompiledContract = {
    abi: any,
    bytecode: any,
    deployedByteCode: any,
    gasEstimates: any
}