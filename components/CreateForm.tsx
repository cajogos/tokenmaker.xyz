import { StatusCodes } from 'http-status-codes';
import React, { BaseSyntheticEvent } from 'react';
import { FaCheck, FaRocket } from 'react-icons/fa';
import Web3 from 'web3';
import ContractDeployer from '../classes/ContractDeployer';

type CreateFormProps = {
    disabled: boolean
};
type CreateFormState = {
    contractType: string,
    params: {
        [globalName: string]: any
    },
    tokenName: string,
    tokenSymbol: string
};

class CreateForm extends React.Component<CreateFormProps, CreateFormState>
{
    // The available contract types
    static CONTRACT_TYPE_COUNTER: string = 'Counter';
    static CONTRACT_TYPE_ERC20_BASIC: string = 'ERC20Basic';
    static CONTRACT_TYPE_ERC20_EXTENDED: string = 'ERC20Extended';

    // This sets the default contract state
    // static CONTRACT_TYPE_DEFAULT: string = CreateForm.CONTRACT_TYPE_ERC20_BASIC;
    static CONTRACT_TYPE_DEFAULT: string = CreateForm.CONTRACT_TYPE_COUNTER;

    constructor(props: CreateFormProps)
    {
        super(props);
        this.state = {
            contractType: CreateForm.CONTRACT_TYPE_DEFAULT,
            params: {},
            tokenName: '',
            tokenSymbol: ''
        };
    }

    onFormSubmission(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault();

        console.log(this.state.params);

        fetch('/api/contract/compile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contractType: this.state.contractType,
                tokenName: this.state.tokenName,
                tokenSymbol: this.state.tokenSymbol
            })
        }).then((response: Response) =>
        {
            if (response.status === StatusCodes.OK)
            {
                response.json().then((parsed: ExpectedResponse) =>
                {
                    if (parsed.success)
                    {
                        if (typeof parsed.result !== 'undefined')
                        {
                            const output = parsed.result.output;
                            ContractDeployer.deploy(output.compiled.contracts[this.state.contractType])
                        }
                    }
                });
            }
        }).catch(error => console.error(error));
    }

    handleContractTypeChange(event: BaseSyntheticEvent)
    {
        this.setState({
            contractType: event.target.value
        });
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
                        <input type="text" required className="form-control" aria-describedby="tokenNameHelp" disabled={this.props.disabled}
                            defaultValue={this.state.tokenName} onChange={(e) => this.handleParamChange(e, 'tokenName')} />
                        <div id="tokenNameHelp" className="form-text">Choose a suitable name for your new token. E.g. "Westminter Token".</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Token Symbol</label>
                        <input type="text" required className="form-control" aria-describedby="tokenSymbolHelp" disabled={this.props.disabled}
                            defaultValue={this.state.tokenSymbol} onChange={(e) => this.handleParamChange(e, 'tokenSymbol')} />
                        <div id="tokenSymbolHelp" className="form-text">Choose a symbol for your new token. Preferably less than 5 characters long. E.g. "UOW".</div>
                    </div>
                </>
            );
        }
        if (this.state.contractType === CreateForm.CONTRACT_TYPE_ERC20_EXTENDED)
        {
            return (
                <div className="alert alert-danger">Coming soon...</div>
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
                        disabled={this.props.disabled}
                        aria-describedby="contractTypeHelp"
                        defaultValue={CreateForm.CONTRACT_TYPE_DEFAULT}
                        onChange={this.handleContractTypeChange.bind(this)}>
                        <option value={CreateForm.CONTRACT_TYPE_ERC20_BASIC}>ERC20 Basic</option>
                        <option value={CreateForm.CONTRACT_TYPE_ERC20_EXTENDED}>ERC20 Extended</option>
                        <option value={CreateForm.CONTRACT_TYPE_COUNTER}>Counter (Test)</option>
                    </select>
                    <div id="contractTypeHelp" className="form-text">Choose the contract type for your token.</div>
                </div>
                {this.renderForContractType()}
                <button type="submit" className="btn btn-primary" disabled={this.props.disabled}>
                    <span><FaCheck /> Confirm Details</span>
                </button>
            </form>
        );
    }
}

export default CreateForm;