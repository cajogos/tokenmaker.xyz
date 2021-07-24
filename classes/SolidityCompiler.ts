import solc, { Abi, CompilerInput, CompilerInputSources, CompilerOutput } from 'solc';

type CompilerSettings = {
    outputSelection: object
};

type ContractResult = {
    [globalName: string]: {
        abi: any,
        bytecode: any,
        deployedByteCode: any
    }
}

export type SolidityCompilerResult = {
    contracts: {
        [globalName: string]: ContractResult
    }
};

class SolidityCompiler
{
    public compile(contractName: string, fileContents: string): SolidityCompilerResult
    {
        // Set up the sources
        let sources: CompilerInputSources = {};
        sources[contractName] = {
            content: fileContents
        };

        // https://docs.soliditylang.org/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description

        // Settings
        let settings: CompilerSettings = {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        };

        const input: CompilerInput = { language: 'Solidity', sources, settings };
        const processed: string = JSON.stringify(input);

        const compiled: string = solc.compile(processed);
        const parsed: CompilerOutput = JSON.parse(compiled);

        const compiledContracts = parsed.contracts[contractName];

        let contracts: ContractResult = {};
        for (var key in compiledContracts)
        {
            let contract = compiledContracts[key];
            contracts[key] = {
                abi: contract.abi,
                bytecode: contract.evm?.bytecode,
                deployedByteCode: contract.evm?.deployedBytecode
            };
        }

        return { contracts };
    }
}

export default SolidityCompiler;