import React from 'react';
import MetaMaskConnector from '../classes/MetaMaskConnector';
import IMetaMaskListener from '../interfaces/IMetaMaskListener';

type WalletButtonProps = {};
type WalletButtonState = {
    walletStatus: number,
    connected: boolean,
    connectedAccount: string | null,
    connectedNetwork: number | null
};

class WalletButton extends React.Component<WalletButtonProps, WalletButtonState>
    implements IMetaMaskListener
{
    constructor(props: WalletButtonProps)
    {
        super(props);
        this.state = {
            walletStatus: MetaMaskConnector.STATE_NOT_INSTALLED,
            connected: false,
            connectedAccount: null,
            connectedNetwork: null
        };

        // Make this component listen to MetaMask events
        MetaMaskConnector.addListener(this);
    }

    public componentDidMount(): void
    {
        // On component mount we must check for the wallet state
        this.populateStateWithWallet();
    }

    public onAccountChanged(account: string | null): void
    {
        this.populateStateWithWallet();
    }

    public onNetworkChanged(network: number | null): void
    {
        this.populateStateWithWallet();
    }

    private populateStateWithWallet()
    {
        this.setState({
            walletStatus: MetaMaskConnector.getState(),
            connected: MetaMaskConnector.getInstance().isConnected(),
            connectedAccount: MetaMaskConnector.getInstance().getCurrentAccount(),
            connectedNetwork: MetaMaskConnector.getInstance().getCurrentNetwork()
        });
    }

    async handleClick()
    {
        // This will trigger MetaMask to allow connection if not already connected
        if (!this.state.connected)
        {
            let connected = await MetaMaskConnector.getInstance().requestAccounts();
            if (connected)
            {
                this.populateStateWithWallet();
            }
        }
    }

    render()
    {
        // If the wallet is not installed we clicking the button will send the user to MetaMask
        if (this.state.walletStatus === MetaMaskConnector.STATE_NOT_INSTALLED)
        {
            return (
                <>
                    <a href="https://metamask.io/" className="btn btn-danger" target="_blank">
                        <span>Install MetaMask</span>
                    </a>
                </>
            );
        }

        // When the wallet is installed the user will have:
        // - Wallet not connected: "Connect Your Wallet"
        // - Wallet connected: Part of the hash of the connected account
        return (
            <>
                <small className="text-danger fw-bold mx-3">{MetaMaskConnector.getNetworkName(this.state.connectedNetwork)}</small>
                {this.state.connected ?
                    <button className="btn btn-outline-success text-white">
                        <span>{this.state.connectedAccount?.substr(0, 10) + '...' + this.state.connectedAccount?.substr(-5)}</span>
                    </button>
                    :
                    <button onClick={this.handleClick.bind(this)} className="btn btn-primary border-2 border-white">
                        <span>Connect Your Wallet</span>
                    </button>
                }
            </>

        );
    }
};

export default WalletButton;