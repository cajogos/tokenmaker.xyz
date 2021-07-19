import BaseContract, { ContractReplacements } from './BaseContract';
import { SolidityCompilerResult } from '../SolidityCompiler';

class ERC20 extends BaseContract
{
    public getContractName(): string
    {
        return 'ERC20';
    }

    public compile(): SolidityCompilerResult
    {
        return this.compileContract();
    }
}

export default ERC20;