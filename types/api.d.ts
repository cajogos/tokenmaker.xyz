declare type APIError = {
    errorCode: number,
    errorMessage: string
};

declare type ValidResult = {
    input: object,
    output: SolidityCompilerResult
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