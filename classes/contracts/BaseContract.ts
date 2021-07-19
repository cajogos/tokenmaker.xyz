import fs from 'fs';
import path from 'path';
import SolidityCompiler, { SolidityCompilerResult } from '../SolidityCompiler';

export type ContractReplacements = {
    [globalName: string]: string | number | boolean
};

export type ContractArguments = any[];

abstract class BaseContract
{
    protected arguments: ContractArguments = [];

    public addArgument(value: any): void
    {
        this.arguments.push(value);
    }

    protected replacements: ContractReplacements = {};

    public addReplacement(key: string, value: any): void
    {
        this.replacements[key] = value;
    }

    protected getContractFile(): Buffer
    {
        const contractsDir = path.resolve(process.env.projectRoot + '/contracts');
        const filePath = `${contractsDir}/${this.getContractName()}.sol`;
        return fs.readFileSync(filePath);
    }

    public abstract getContractName(): string;

    public abstract compile(): SolidityCompilerResult;

    protected compileContract(): SolidityCompilerResult
    {
        const file = this.getContractFile();
        const compiler = new SolidityCompiler();
        let fileContents = file.toString();
        for (let key in this.replacements)
        {
            fileContents = fileContents.replace(key, this.replacements[key]?.toString());
        }
        return compiler.compile(this.getContractName(), fileContents);
    }
}

export default BaseContract;