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
    compiled: {
        contracts: {
            [key: string]: CompiledContract;
        }
    };
    deployed: any;
};

class CreatePageController extends BaseController
{
    private listeners: ICreatePageListener[] = [];

    private contractCompiled: boolean = false;
    private contractDeployed: boolean = false;

    private contract: ControllerContract = {
        contractType: '',
        compiled: {
            contracts: {}
        },
        deployed: null
    };

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
                this.contract.compiled = jsonResponse.result.output.compiled;

                this.contractCompiled = true;
                this.fireContractCompiledEvent();
                return jsonResponse.result;
            }
        }
    }

    public deployContract(): void
    {
        if (this.contractCompiled)
        {
            // deploy the contract
            // ContractDeployer.deploy(output.compiled.contracts[this.state.contractType])
            this.fireContractDeployedEvent();
            this.contractDeployed = true;
        }
    }
}

export default CreatePageController;