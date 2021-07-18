import BaseContract from './BaseContract';
import { SolidityCompilerResult } from '../SolidityCompiler';

class Counter extends BaseContract
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