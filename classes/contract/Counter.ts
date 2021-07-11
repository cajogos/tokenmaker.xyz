import Contract from '../Contract';
import { SolidityCompilerResult } from '../SolidityCompiler';

class Counter extends Contract
{
    public getContractName(): string
    {
        return 'Counter';
    }

    public compile(): SolidityCompilerResult
    {
        return this.compileContract();
    }
}

export default Counter;