import solc, { Abi, CompilerInput, CompilerInputSources, CompilerOutput } from 'solc';

type CompilerSettings = {
    outputSelection: object
};

export type SolidityCompilerResult = {
    abi: any,
    bytecode: any,
    deployedByteCode: any,
    gasEstimates: any
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
        console.log(parsed);

        const contract = parsed.contracts[contractName][contractName];

        return {
            abi: contract.abi,
            bytecode: contract.evm?.bytecode,
            deployedByteCode: contract.evm?.deployedBytecode,
            gasEstimates: contract.evm?.gasEstimates
        };
    }
}

export default SolidityCompiler;