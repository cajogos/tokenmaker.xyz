import Contract, { ContractReplacements } from '../Contract';
import { SolidityCompilerResult } from '../SolidityCompiler';

class ERC20Basic extends Contract
{
    private tokenName: string = '';
    private tokenSymbol: string = '';

    public setTokenName(tokenName: string)
    {
        this.tokenName = tokenName;
    }

    public setTokenSymbol(tokenSymbol: string)
    {
        this.tokenSymbol = tokenSymbol;
    }

    public getContractName(): string
    {
        return 'ERC20Basic';
    }

    public compile(): SolidityCompilerResult
    {
        let replacements: ContractReplacements = {
            TOKEN_NAME: this.tokenName,
            TOKEN_SYMBOL: this.tokenSymbol
        };
        return this.compileContract(replacements);
    }
}

export default ERC20Basic;