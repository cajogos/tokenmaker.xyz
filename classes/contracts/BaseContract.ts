import fs from 'fs';
import path from 'path';
import SolidityCompiler, { SolidityCompilerResult } from '../SolidityCompiler';

type ContractReplacements = {
    [globalName: string]: string | number | boolean
};

type ContractArguments = any[];

abstract class BaseContract
{
    // Every contract should have a name that matches their contract file
    protected contractName: string = '';

    // Arguments will be sent to the contract constructor
    protected arguments: ContractArguments = [];
    public addArgument(value: any): void
    {
        this.arguments.push(value);
    }

    // Replacements will be applied to the contract code before compiling
    protected replacements: ContractReplacements = {};
    public addReplacement(key: string, value: any): void
    {
        this.replacements[key] = value;
    }

    public compile(): SolidityCompilerResult
    {
        // Get the contract contents and do the replacements
        let fileContents = this.getContractFileContents().toString();
        for (let key in this.replacements)
        {
            fileContents = fileContents.replace(key, this.replacements[key]?.toString());
        }
        // Compile the contract using the Solidity Compiler
        return (new SolidityCompiler())
            .compile(this.contractName, fileContents);
    }

    // Get the contract file contents as a Buffer
    private getContractFileContents(): Buffer
    {
        const contractsDir = path.resolve(process.env.projectRoot + '/contracts');
        const filePath = `${contractsDir}/${this.contractName}.sol`;
        return fs.readFileSync(filePath);
    }
}

export default BaseContract;