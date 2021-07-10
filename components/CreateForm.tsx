import { StatusCodes } from 'http-status-codes';
import React, { BaseSyntheticEvent } from 'react';

type CreateFormProps = {};
type CreateFormState = {
    contractType: string,
    tokenName: string,
    tokenSymbol: string
};

class CreateForm extends React.Component<CreateFormProps, CreateFormState>
{
    // The available contract types - TODO: Move to other place?
    static CONTRACT_TYPE_ERC20_BASIC: string = 'ERC20Basic';
    static CONTRACT_TYPE_ERC20_EXTENDED: string = 'ERC20Extended';

    // This sets the default contract state
    static CONTRACT_TYPE_DEFAULT: string = CreateForm.CONTRACT_TYPE_ERC20_BASIC;

    constructor(props: CreateFormProps)
    {
        super(props);
        this.state = {
            contractType: CreateForm.CONTRACT_TYPE_DEFAULT,
            tokenName: '',
            tokenSymbol: ''
        };
    }

    onFormSubmission(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault();

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
                        console.log(parsed.result);
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

    handleTokenNameChange(event: BaseSyntheticEvent)
    {
        let tokenName = event.target.value.trim();
        this.setState({
            tokenName: tokenName
        });
    }

    handleTokenSymbolChange(event: BaseSyntheticEvent)
    {
        let tokenSymbol = event.target.value.trim().toUpperCase();
        this.setState({
            tokenSymbol: tokenSymbol
        });
    }

    render()
    {
        return (
            <form onSubmit={this.onFormSubmission.bind(this)}>
                <div className="mb-3">
                    <label className="form-label">Contract Type</label>
                    <select className="form-select"
                        aria-describedby="contractTypeHelp"
                        defaultValue={CreateForm.CONTRACT_TYPE_DEFAULT}
                        onChange={this.handleContractTypeChange.bind(this)}>
                        <option value={CreateForm.CONTRACT_TYPE_ERC20_BASIC}>ERC20 Basic</option>
                        <option value={CreateForm.CONTRACT_TYPE_ERC20_EXTENDED}>ERC20 Extended</option>
                    </select>
                    <div id="contractTypeHelp"
                        className="form-text">Choose the contract type for your token.</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Token Name {this.state.tokenName}</label>
                    <input type="text" required
                        className="form-control"
                        aria-describedby="tokenNameHelp"
                        defaultValue={this.state.tokenName}
                        onChange={this.handleTokenNameChange.bind(this)} />
                    <div id="tokenNameHelp"
                        className="form-text">Choose a suitable name for your new token. E.g. "Westminter Token".</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Token Symbol {this.state.tokenSymbol}</label>
                    <input type="text" required
                        className="form-control"
                        aria-describedby="tokenSymbolHelp"
                        defaultValue={this.state.tokenSymbol}
                        onChange={this.handleTokenSymbolChange.bind(this)} />
                    <div id="tokenSymbolHelp"
                        className="form-text">Choose a symbol for your new token. Preferably less than 5 characters long. E.g. "UOW".</div>
                </div>
                <button type="submit" className="btn btn-primary">Confirm Details</button>
            </form>
        );
    }
}

export default CreateForm;