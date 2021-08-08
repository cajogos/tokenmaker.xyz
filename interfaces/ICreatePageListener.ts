// Interface for listeners of the create page controller
export default interface ICreatePageListener
{
    onPageEnabled(isEnabled: boolean): void;
    onContractChanged(): void;
    onContractCompiled(): void;
    onContractDeployed(): void;
    onContractCompiledError(errorCode: number, errorMessage: string): void;
}
