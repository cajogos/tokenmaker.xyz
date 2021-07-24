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
    isCompiling: boolean;
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
    // static CONTRACT_TYPE_DEFAULT: string = CreateForm.CONTRACT_TYPE_COUNTER;

    constructor(props: CreateFormProps)
    {
        super(props);
        this.state = {
            disabled: this.props.disabled,
            contractType: CreateForm.CONTRACT_TYPE_DEFAULT,
            params: {},
            isCompiling: false,
            hasError: false,
            errorCode: 0,
            errorMessage: ''
        };

        this.props.pageManager.addListener(this);
    }

    public onContractCompiledError(errorCode: number, errorMessage: string): void
    {
        this.setState({
            isCompiling: false,
            disabled: false,
            hasError: true,
            errorCode: errorCode,
            errorMessage: errorMessage
        });
    }

    public onContractChanged(): void { }

    public onContractCompiled(): void
    {
        this.setState({
            isCompiling: false,
            disabled: false,
            hasError: false
        });
    }

    public onContractDeployed(): void { }

    async onFormSubmission(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault();

        this.setState({
            disabled: true,
            isCompiling: true
        });

        await this.props.pageManager.compileContract({
            contractType: this.state.contractType,
            arguments: this.state.params
        });
    }

    handleContractTypeChange(event: BaseSyntheticEvent)
    {
        this.setState({
            contractType: event.target.value,
            params: {}
        });
        this.props.pageManager.setContractType(this.state.contractType);
    }

    handleParamChange(event: BaseSyntheticEvent, param: string)
    {
        let currentParams = this.state.params;
        currentParams[param] = event.target.value.trim();
        this.setState({
            params: currentParams
        });
    }

    renderForContractType(): JSX.Element
    {
        if (this.state.contractType === CreateForm.CONTRACT_TYPE_COUNTER)
        {
            return (
                <div className="alert alert-info">No params required.</div>
            );
        }
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
        return (<></>);
    }

    render()
    {
        return (
            <form onSubmit={this.onFormSubmission.bind(this)}>
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
                {this.state.hasError &&
                    <div className="alert alert-danger">
                        <FaExclamationTriangle className="me-2" /><strong>Error {this.state.errorCode}: </strong><span>{this.state.errorMessage}</span>
                    </div>
                }
                {this.renderForContractType()}
                <button type="submit" className="btn btn-primary" disabled={this.state.disabled}>
                    <span><FaCheck /> Confirm Details</span>
                </button>
                {this.state.isCompiling &&
                    <span className="fst-italic small ms-3"><FaSpinner className="icon-spin me-1" /> Compiling...</span>
                }
            </form>
        );
    }
}

export default CreateForm;