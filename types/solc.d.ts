// Sourced from: https://github.com/ethereum/solc-js/pull/205/files
declare module 'solc'
{
    export type Primitive =
        'bool' | 'string' | 'address' | 'bytes' | 'bytes20' | 'bytes32' |
        'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' |
        'int8' | 'int16' | 'int32' | 'int64' | 'int128' | 'int256' |
        'bool[]' | 'string[]' | 'address[]' | 'bytes[]' | 'bytes20[]' | 'bytes32[]' |
        'uint8[]' | 'uint16[]' | 'uint32[]' | 'uint64[]' | 'uint128[]' | 'uint256[]' |
        'int8[]' | 'int16[]' | 'int32[]' | 'int64[]' | 'int128[]' | 'int256[]';

    export interface AbiParameter
    {
        name: string,
        type: Primitive,
    }

    export interface AbiEventParameter extends AbiParameter
    {
        indexed: boolean,
    }

    export interface AbiFunction
    {
        name: string,
        type: 'function' | 'constructor' | 'fallback',
        stateMutability: 'pure' | 'view' | 'payable' | 'nonpayable',
        constant: boolean,
        payable: boolean,
        inputs: Array<AbiParameter>,
        outputs: Array<AbiParameter>,
    }

    export interface AbiEvent
    {
        name: string,
        type: 'event',
        inputs: Array<AbiEventParameter>,
        anonymous: boolean,
    }

    export type Abi = Array<AbiFunction | AbiEvent>;

    interface CompilerInputSources
    {
        [globalName: string]: {
            keccak256?: string;
            content: string;
        }
    }

    interface CompilerInput
    {
        language: "Solidity" | "serpent" | "lll" | "assembly";
        settings?: any;
        sources: CompilerInputSources;
    }

    interface CompilerOutputError
    {
        sourceLocation?: {
            file: string;
            start: number;
            end: number;
        };
        type: "TypeError" | "InternalCompilerError" | "Exception";
        component: "general" | "ewasm";
        severity: "error" | "warning";
        message: string;
        formattedMessage?: string;
    }

    interface CompilerOutputContracts
    {
        [globalName: string]: {
            [contractName: string]: {
                abi?: Array<AbiEvent | AbiFunction>;
                metadata?: string;
                userdoc?: any;
                devdoc?: any;
                ir?: string;
                evm?: {
                    assembly?: string;
                    legacyAssembly?: any;
                    bytecode: CompilerOutputEvmBytecode;
                    deployedBytecode?: CompilerOutputEvmBytecode;
                    methodIdentifiers?: {
                        [methodName: string]: string;
                    };
                    gasEstimates?: {
                        creation: {
                            codeDepositCost: string;
                            executionCost: string;
                            totalCost: string;
                        };
                        external: {
                            [functionSignature: string]: string;
                        };
                        internal: {
                            [functionSignature: string]: string;
                        };
                    };
                };
                ewasm: {
                    wast?: string;
                    wasm?: string;
                }
            }
        };
    }

    interface CompilerOutputSources
    {
        [globalName: string]: {
            id: number;
            ast?: any;
            legacyAST?: any;
        },
    }

    interface CompilerOutput
    {
        errors: CompilerOutputError[];
        sources: CompilerOutputSources;
        contracts: CompilerOutputContracts;
    }

    function compile(processed: string): string;
}