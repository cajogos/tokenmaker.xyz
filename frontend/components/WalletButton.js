import React from 'react';

class WalletButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    handleClick()
    {
        console.log(this);
    }
    
    render()
    {
        return (
            <button onClick={this.handleClick.bind(this)} className="btn btn-outline-light">
                <span>Connect Wallet</span>
            </button>
        );
    }
};

export default WalletButton;