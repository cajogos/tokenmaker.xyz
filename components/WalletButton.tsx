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

class WalletButton extends React.Component<WalletButtonProps, WalletButtonState> implements IMetaMaskListener
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

        MetaMaskConnector.addListener(this);
    }

    public componentDidMount(): void
    {
        this.populateStateWithWallet();
    }

    private populateStateWithWallet()
    {
        console.log('populating state wallet button');
        this.setState({
            walletStatus: MetaMaskConnector.getState(),
            connected: MetaMaskConnector.getInstance().isConnected(),
            connectedAccount: MetaMaskConnector.getInstance().getCurrentAccount(),
            connectedNetwork: MetaMaskConnector.getInstance().getCurrentNetwork()
        });
    }

    async handleClick()
    {
        if (!this.state.connected)
        {
            let connected = await MetaMaskConnector.getInstance().requestAccounts();
            if (connected)
            {
                this.populateStateWithWallet();
            }
        }
    }

    public handleAccountChangedEvent(account: string | null): void
    {
        this.populateStateWithWallet();
    }

    public handleNetworkChangedEvent(network: number | null): void
    {
        this.populateStateWithWallet();
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
                    <>
                        <small className="text-danger fw-bold mx-3">{MetaMaskConnector.getNetworkName(this.state.connectedNetwork)}</small>
                        <button onClick={this.handleClick.bind(this)} className="btn btn-outline-light">
                            <span>{this.state.connected ?
                                this.state.connectedAccount?.substr(0, 10) + '...'
                                :
                                'Connect Your Wallet'}</span>
                        </button>
                    </>
                }
            </>
        );
    }
};

export default WalletButton;