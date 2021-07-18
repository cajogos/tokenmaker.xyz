interface ICreatePageListener
{
    onContractChanged(): void;
    onContractCompiled(): void;
    onContractDeployed(): void;
}

export default ICreatePageListener;