import solc, { CompilerInput, CompilerInputSources, CompilerOutput } from 'solc';

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

        // This is the default settings provided by Web3
        let settings: CompilerSettings = {
            outputSelection: { '*': { '*': ['*'] } }
        };

        // Prepare the input for the contract to be compiled
        const input: CompilerInput = { language: 'Solidity', sources, settings };
        const processed: string = JSON.stringify(input);

        // Compile the contract using solc
        const compiled: string = solc.compile(processed);
        const parsed: CompilerOutput = JSON.parse(compiled);

        // Once the array of contracts is parsed - prepare a better ouput (SolidityCompilerResult)
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