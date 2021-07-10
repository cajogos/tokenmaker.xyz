import fs from 'fs';
import path from 'path';
import SolidityCompiler, { SolidityCompilerResult } from './SolidityCompiler';

export type ContractReplacements = {
    [globalName: string]: string | number
};

abstract class Contract
{
    protected getContractFile(): Buffer
    {
        const contractsDir = path.resolve(process.env.projectRoot + '/contracts');
        const filePath = `${contractsDir}/${this.getContractName()}.sol`;
        return fs.readFileSync(filePath);
    }

    public abstract getContractName(): string;

    public abstract compile(): SolidityCompilerResult;

    protected compileContract(replacements: ContractReplacements): SolidityCompilerResult
    {
        const file = this.getContractFile();
        const compiler = new SolidityCompiler();
        let fileContents = file.toString();
        for (let key in replacements)
        {
            fileContents = fileContents.replace(key, replacements[key]?.toString());
        }
        console.log(fileContents);
        return compiler.compile(this.getContractName(), fileContents);
    }
}

export default Contract;