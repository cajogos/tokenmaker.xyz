import React from 'react';

class CreateForm extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    onFormSubmission(e)
    {
        e.preventDefault();
    }

    render()
    {
        return (
            <form onSubmit={this.onFormSubmission.bind(this)}>
                <div className="mb-3">
                    <label className="form-label">Token Name</label>
                    <input type="text" className="form-control" aria-describedby="tokenNameHelp" />
                    <div id="tokenNameHelp" className="form-text">Choose a suitable name for your new token. E.g. "Westminter Token".</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Token Symbol</label>
                    <input type="text" className="form-control" aria-describedby="tokenSymbolHelp" />
                    <div id="tokenSymbolHelp" className="form-text">Choose a symbol for your new token. Preferably less than 5 characters long. E.g. "UOW".</div>
                </div>
                <button type="submit" className="btn btn-primary">Deploy Token</button>
            </form>
        );
    }
}

export default CreateForm;