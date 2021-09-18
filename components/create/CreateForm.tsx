import React, { BaseSyntheticEvent } from 'react';
import { FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import CreatePageController from '../../controllers/CreatePageController';
import ICreatePageListener from '../../interfaces/ICreatePageListener';

type CreateFormProps = {
    pageManager: CreatePageController;
    disabled: boolean;
};
type CreateFormState = {
    disabled: boolean;
    contractType: string;
    params: {
        [key: string]: any
    };
    compiling: boolean;
    hasError: boolean;
    errorCode: number;
    errorMessage: string;
};

class CreateForm extends React.Component<CreateFormProps, CreateFormState>
    implements ICreatePageListener
{
    // The available contract types
    static CONTRACT_TYPE_COUNTER: string = 'Counter';
    static CONTRACT_TYPE_ERC20: string = 'ERC20';

    // This sets the default contract state
    static CONTRACT_TYPE_DEFAULT: string = CreateForm.CONTRACT_TYPE_ERC20;

    constructor(props: CreateFormProps)
    {
        super(props);
        this.state = {
            // Flag to check if the elements should be enabled / disabled
            disabled: this.props.disabled,
            // The chosen contract type
            contractType: CreateForm.CONTRACT_TYPE_DEFAULT,
            // The parameters for the contract
            params: {},
            // Flag to check if the contract is being compiled
            compiling: false,
            // Flag to check if the contract parameters are valid
            hasError: false,
            errorCode: 0,
            errorMessage: ''
        };

        // Add this component to the Create Page Controller listeners
        this.props.pageManager.addListener(this);
    }

    public onPageEnabled(isEnabled: boolean): void
    {
        this.setState({ disabled: !isEnabled });
    }

    public onContractCompiledError(errorCode: number, errorMessage: string): void
    {
        this.setState({
            compiling: false,
            disabled: false,
            hasError: true,
            errorCode: errorCode,
            errorMessage: errorMessage
        });
    }

    public onContractChanged(): void { }

    // This function will be called when the contract has been compiled by the controller
    public onContractCompiled(): void
    {
        this.setState({ compiling: false, disabled: false, hasError: false });
    }

    public onContractDeployed(): void { }

    private async onFormSubmission(e: React.FormEvent<HTMLFormElement>)
    {
        // Stop the form from submitting
        e.preventDefault();

        // Disable the form while the contract is being compiled
        this.setState({ disabled: true, compiling: true });

        // Send the contract to the compilation using the controller
        await this.props.pageManager.compileContract({
            contractType: this.state.contractType,
            arguments: this.state.params
        });
    }

    private handleContractTypeChange(event: BaseSyntheticEvent)
    {
        this.setState({ contractType: event.target.value, params: {} });

        // Alert the controller that the contract type has changed
        this.props.pageManager.setContractType(this.state.contractType);
    }

    private handleParamChange(event: BaseSyntheticEvent, param: string)
    {
        // Get the current params to be changed
        let currentParams = this.state.params;
        currentParams[param] = event.target.value.trim();

        // Update the state with the new params
        this.setState({ params: currentParams });
    }

    private renderForContractType(): JSX.Element
    {
        // Display the params for the Counter contract (test contract)
        if (this.state.contractType === CreateForm.CONTRACT_TYPE_COUNTER)
        {
            return (
                <div className="alert alert-info">No params required.</div>
            );
        }
        // Display the params for the ERC20 contract
        if (this.state.contractType === CreateForm.CONTRACT_TYPE_ERC20)
        {
            return (
                <>
                    <div className="mb-3">
                        <label className="form-label">Token Name</label>
                        <input type="text" className="form-control" id="inputTokenName"
                            disabled={this.state.disabled} required={true}
                            onChange={(e) => this.handleParamChange(e, 'tokenName')}
                            aria-describedby="tokenNameHelp" />
                        <div id="tokenNameHelp" className="form-text">
                            <span>Choose a suitable name for your new token. E.g. "Westminter Token".</span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Token Symbol</label>
                        <input type="text" className="form-control" id="inputTokenSymbol"
                            disabled={this.state.disabled} required={true}
                            onChange={(e) => this.handleParamChange(e, 'tokenSymbol')}
                            aria-describedby="tokenSymbolHelp" />
                        <div id="tokenSymbolHelp" className="form-text">
                            <span>Choose a symbol for your new token. Preferably less than 5 characters long. E.g. "UOW".</span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Initial Supply</label>
                        <input type="text" className="form-control" id="inputInitialSupply"
                            disabled={this.state.disabled} required={true}
                            onChange={(e) => this.handleParamChange(e, 'initialSupply')}
                            aria-describedby="initialSupplyHelp" />
                        <div id="initialSupplyHelp" className="form-text">
                            <span>Choose the initial token supply. This will be sent to your wallet address on creation.</span>
                        </div>
                    </div>
                </>
            );
        }
        return <></>;
    }

    render()
    {
        return (
            <form onSubmit={this.onFormSubmission.bind(this)} autoComplete="off">
                <div className="mb-3">
                    <label className="form-label">Contract Type</label>
                    <select className="form-select"
                        disabled={this.state.disabled}
                        aria-describedby="contractTypeHelp"
                        defaultValue={CreateForm.CONTRACT_TYPE_DEFAULT}
                        onChange={this.handleContractTypeChange.bind(this)}>
                        <option value={CreateForm.CONTRACT_TYPE_ERC20}>ERC20 Basic</option>
                        <option value={CreateForm.CONTRACT_TYPE_COUNTER}>Counter (Test)</option>
                    </select>
                    <div id="contractTypeHelp" className="form-text">Choose the contract type for your token.</div>
                </div>

                {/* Display an error if there are any */}
                {this.state.hasError &&
                    <div className="alert alert-danger">
                        <FaExclamationTriangle className="me-2" /><strong>Error {this.state.errorCode}: </strong><span>{this.state.errorMessage}</span>
                    </div>
                }

                {/* Each contract has their own set of required params */}
                {this.renderForContractType()}

                {/* This button will submit the form for contract compilation */}
                <button type="submit" className="btn btn-primary" disabled={this.state.disabled}>
                    <span><FaCheck /> Confirm Details</span>
                </button>

                {/* Display a message while the contract is being compiled */}
                {this.state.compiling &&
                    <span className="fst-italic small ms-3">
                        <FaSpinner className="icon-spin me-1" /> Compiling...
                    </span>
                }
            </form>
        );
    }
}

export default CreateForm;