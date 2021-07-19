import { StatusCodes } from 'http-status-codes';
import ContractDeployer from '../classes/ContractDeployer';
import ICreatePageListener from '../interfaces/ICreatePageListener';
import BaseController from './BaseController';

export type ContractToCompile = {
    contractType: string;
    arguments: {
        [key: string]: any;
    }
};

type ControllerContract = {
    contractType: string,
    arguments: any,
    compiled: {
        contracts: {
            [key: string]: CompiledContract;
        }
    };
    deployedAddress: string | null;
};

class CreatePageController extends BaseController
{
    private listeners: ICreatePageListener[] = [];

    private contractCompiled: boolean = false;
    private contractDeployed: boolean = false;

    private contract: ControllerContract = {
        contractType: '',
        arguments: {},
        compiled: {
            contracts: {}
        },
        deployedAddress: null
    };

    public setContractType(contractType: string): void
    {
        this.contract.contractType = contractType;
        this.fireContractChangedEvent();
    }

    public getContract(): ControllerContract
    {
        return this.contract;
    }

    public addListener(listener: ICreatePageListener): void
    {
        this.listeners.push(listener);
    }

    private fireContractChangedEvent(): void
    {
        this.listeners.forEach(listener => listener.onContractChanged());
    }

    private fireContractCompiledEvent(): void
    {
        this.listeners.forEach(listener => listener.onContractCompiled());
    }

    private fireContractCompiledErrorEvent(errorCode: number, errorMessage: string): void
    {
        this.listeners.forEach(listener => listener.onContractCompiledError(errorCode, errorMessage));
    }

    private fireContractDeployedEvent(): void
    {
        this.listeners.forEach(listener => listener.onContractDeployed());
    }

    public async compileContract(contract: ContractToCompile): Promise<void>
    {
        const response = await fetch('/api/contract/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contract)
        });
        if (response.status === StatusCodes.OK)
        {
            const jsonResponse = await response.json();
            if (jsonResponse.success)
            {
                this.contract.contractType = contract.contractType;
                this.contract.arguments = jsonResponse.result.input;
                this.contract.compiled = jsonResponse.result.output.compiled;

                this.contractCompiled = true;
                this.fireContractCompiledEvent();
                return jsonResponse.result;
            }
            if (jsonResponse.error)
            {
                this.contractCompiled = false;
                this.fireContractCompiledErrorEvent(jsonResponse.error.errorCode, jsonResponse.error.errorMessage);
                return jsonResponse.result;
            }
        }
    }

    public async deployContract(): Promise<void>
    {
        if (this.contractCompiled)
        {
            let args: any = [];
            if (this.contract.contractType === 'ERC20')
            {
                args.push(this.contract.arguments.tokenName);
                args.push(this.contract.arguments.tokenSymbol);
            }
            this.contract.deployedAddress = await ContractDeployer
                .deploy(this.contract.compiled.contracts[this.contract.contractType], args);
            this.fireContractDeployedEvent();
            this.contractDeployed = true;
        }
    }
}

export default CreatePageController;