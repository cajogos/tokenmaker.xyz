import React, { BaseSyntheticEvent } from 'react';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import CreatePageController from '../../controllers/CreatePageController';
import ICreatePageListener from '../../interfaces/ICreatePageListener';

type CreateFormProps = {
    pageManager: CreatePageController
};
type CreateFormState = {
    disabled: boolean;
    contractType: string;
    params: {
        [key: string]: any
    };
    isCompiling: boolean;
};

class CreateForm extends React.Component<CreateFormProps, CreateFormState>
    implements ICreatePageListener
{
    // The available contract types
    static CONTRACT_TYPE_COUNTER: string = 'Counter';
    static CONTRACT_TYPE_ERC20_BASIC: string = 'ERC20Basic';

    // This sets the default contract state
    // static CONTRACT_TYPE_DEFAULT: string = CreateForm.CONTRACT_TYPE_ERC20_BASIC;
    static CONTRACT_TYPE_DEFAULT: string = CreateForm.CONTRACT_TYPE_COUNTER;

    constructor(props: CreateFormProps)
    {
        super(props);
        this.state = {
            disabled: false,
            contractType: CreateForm.CONTRACT_TYPE_DEFAULT,
            params: {},
            isCompiling: false
        };

        this.props.pageManager.addListener(this);
    }

    public onContractChanged(): void
    {
    }

    public onContractCompiled(): void
    {
        this.setState({
            isCompiling: false,
            disabled: false
        });
    }

    public onContractDeployed(): void
    {
        console.log('contract deployed CreateForm');
    }

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
            contractType: event.target.value
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
        if (this.state.contractType === CreateForm.CONTRACT_TYPE_ERC20_BASIC)
        {
            return (
                <>
                    <div className="mb-3">
                        <label className="form-label">Token Name</label>
                        <input type="text" className="form-control" aria-describedby="tokenNameHelp"
                            disabled={this.state.disabled} required={true}
                            defaultValue="" onChange={(e) => this.handleParamChange(e, 'tokenName')} />
                        <div id="tokenNameHelp"
                            className="form-text">Choose a suitable name for your new token. E.g. "Westminter Token".</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Token Symbol</label>
                        <input type="text" className="form-control" aria-describedby="tokenSymbolHelp"
                            disabled={this.state.disabled} required={true}
                            defaultValue="" onChange={(e) => this.handleParamChange(e, 'tokenSymbol')} />
                        <div id="tokenSymbolHelp"
                            className="form-text">Choose a symbol for your new token. Preferably less than 5 characters long. E.g. "UOW".</div>
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
                        <option value={CreateForm.CONTRACT_TYPE_ERC20_BASIC}>ERC20 Basic</option>
                        <option value={CreateForm.CONTRACT_TYPE_COUNTER}>Counter (Test)</option>
                    </select>
                    <div id="contractTypeHelp" className="form-text">Choose the contract type for your token.</div>
                </div>
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