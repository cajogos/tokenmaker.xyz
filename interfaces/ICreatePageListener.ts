interface ICreatePageListener
{
    onContractChanged(): void;
    onContractCompiled(): void;
    onContractDeployed(): void;
    onContractCompiledError(errorCode: number, errorMessage: string): void;
}

export default ICreatePageListener;