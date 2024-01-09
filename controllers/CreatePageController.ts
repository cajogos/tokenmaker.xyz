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
    deployedAddress: string | undefined;
};

class CreatePageController extends BaseController
{
    private contractCompiled: boolean = false;
    private contractDeployed: boolean = false;

    // The contract object will be used to store information in memory
    private contract: ControllerContract = {
        contractType: '',
        arguments: {},
        compiled: { contracts: {} },
        deployedAddress: undefined
    };
    public getContract(): ControllerContract
    {
        return this.contract;
    }

    public setEnabled(isEnabled: boolean): void
    {
        this.firePageEnabledEvent(isEnabled);
    }

    public setContractType(contractType: string): void
    {
        this.contract.contractType = contractType;
        this.fireContractChangedEvent();
    }

    private listeners: ICreatePageListener[] = [];
    public addListener(listener: ICreatePageListener): void
    {
        this.listeners.push(listener);
    }

    public async compileContract(contract: ContractToCompile): Promise<void>
    {
        // Call the internal compile api
        const response = await fetch('/api/contract/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contract)
        });
        if (response.status === StatusCodes.OK)
        {
            // Convert the response to JSON
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

            // If there is any error (reported by the API)
            if (jsonResponse.error)
            {
                this.contractCompiled = false;
                this.fireContractCompiledErrorEvent(
                    jsonResponse.error.errorCode,
                    jsonResponse.error.errorMessage
                );
                return jsonResponse.result;
            }
        }
    }

    public async deployContract(): Promise<boolean>
    {
        // First check that the contract has been compiled
        if (this.contractCompiled)
        {
            let args: any = [];

            // If the contract is ERC20 we add name and symbol
            if (this.contract.contractType === 'ERC20')
            {
                args.push(this.contract.arguments.tokenName);
                args.push(this.contract.arguments.tokenSymbol);
            }

            // Obtain the correct contract from the compiled contracts
            let compiledContract = this.contract.compiled.contracts[this.contract.contractType]
            this.contract.deployedAddress = await ContractDeployer.deploy(compiledContract, args);

            // The contract has been successfully deployed
            this.fireContractDeployedEvent();
            this.contractDeployed = true;
            return true;
        }
        return false;
    }

    // Event is fired when the page becomes enabled / disabled
    private firePageEnabledEvent(isEnabled: boolean): void
    {
        this.listeners.forEach((listener: ICreatePageListener) =>
            listener.onPageEnabled(isEnabled)
        );
    }

    // Event is fired when the contract type is changed
    private fireContractChangedEvent(): void
    {
        this.listeners.forEach((listener: ICreatePageListener) =>
            listener.onContractChanged()
        );
    }

    // Event is fired when the contract gets compiled
    private fireContractCompiledEvent(): void
    {
        this.listeners.forEach((listener: ICreatePageListener) =>
            listener.onContractCompiled()
        );
    }

    // Event is fired when the contract gets a compilation error
    private fireContractCompiledErrorEvent(errorCode: number, errorMessage: string): void
    {
        this.listeners.forEach((listener: ICreatePageListener) =>
            listener.onContractCompiledError(errorCode, errorMessage)
        );
    }

    // Event is fired when the contract gets deployed
    private fireContractDeployedEvent(): void
    {
        this.listeners.forEach((listener: ICreatePageListener) =>
            listener.onContractDeployed()
        );
    }
}

export default CreatePageController;