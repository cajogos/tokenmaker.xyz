import React from 'react';

type WalletButtonProps = {};
type WalletButtonState = {};

class WalletButton extends React.Component<WalletButtonProps, WalletButtonState>
{
    constructor(props: WalletButtonProps)
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