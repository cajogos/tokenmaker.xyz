import React from 'react';
import MetaMaskConnector from '../classes/MetaMaskConnector';

type WalletButtonProps = {};
type WalletButtonState = {
    walletStatus: number,
    connected: boolean
};

class WalletButton extends React.Component<WalletButtonProps, WalletButtonState>
{
    constructor(props: WalletButtonProps)
    {
        super(props);
        this.state = {
            walletStatus: MetaMaskConnector.STATE_NOT_INSTALLED,
            connected: false
        };

        MetaMaskConnector.getInstance();
    }

    componentDidMount()
    {
        this.setState({
            walletStatus: MetaMaskConnector.getState()
        });
    }

    async handleClick()
    {
        if (MetaMaskConnector.getInstance().isConnected())
        {
            this.setState({
                walletStatus: MetaMaskConnector.getState()
            });
        }
        else
        {
            // Initialise the connection
        }
    }

    render()
    {
        return (
            <>
                {this.state.walletStatus === MetaMaskConnector.STATE_NOT_INSTALLED ?
                    <a href="https://metamask.io/" className="btn btn-danger" target="_blank">
                        <span>Install MetaMask</span>
                    </a>
                    :
                    <button onClick={this.handleClick.bind(this)} className="btn btn-outline-light">
                        <span>{this.state.connected ? 'Connected' : 'Connect Wallet'}</span>
                    </button>
                }
            </>
        );
    }
};

export default WalletButton;