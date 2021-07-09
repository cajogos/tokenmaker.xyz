import IMetaMaskListener from '../interfaces/IMetaMaskListener';

class MetaMaskConnector
{
    // The states of the wallet
    static STATE_NOT_INSTALLED: number = 0;
    static STATE_NOT_CONNECTED: number = 1;
    static STATE_CONNECTED: number = 2;

    // Singleton
    private static instance: MetaMaskConnector;
    public static getInstance(): MetaMaskConnector
    {
        if (!MetaMaskConnector.instance)
        {
            MetaMaskConnector.instance = new MetaMaskConnector();
        }
        return MetaMaskConnector.instance;
    }

    private state: number = MetaMaskConnector.STATE_NOT_INSTALLED; // The state of the wallet
    private currentNetwork: number | null = null; // The currently connected chain ID
    private currentAccount: string | null = null; // The currently selected account address

    // Listeners of the wallet
    private listeners: IMetaMaskListener[] = [];
    public static addListener(listener: IMetaMaskListener): void
    {
        MetaMaskConnector.getInstance()
            .listeners.push(listener);
    }

    private constructor()
    {
        this.checkCurrentState();
        if (this.state !== MetaMaskConnector.STATE_NOT_INSTALLED)
        {
            this.attachEvents();
        }
    }

    private checkCurrentState()
    {
        this.state = MetaMaskConnector.STATE_NOT_INSTALLED;
        if (typeof ethereum !== 'undefined')
        {
            this.state = MetaMaskConnector.STATE_NOT_CONNECTED;

            this.currentNetwork = parseInt(ethereum.networkVersion);
            this.currentAccount = ethereum.selectedAddress;

            if (ethereum.isConnected() && this.currentAccount !== null)
            {
                this.state = MetaMaskConnector.STATE_CONNECTED;
            }
        }
    }

    public static getState(): number
    {
        return MetaMaskConnector.getInstance().state;
    }

    public isInstalled()
    {
        return (this.state !== MetaMaskConnector.STATE_NOT_INSTALLED);
    }

    public isConnected()
    {
        return (this.state === MetaMaskConnector.STATE_CONNECTED);
    }

    public getCurrentNetwork(): number | null
    {
        return this.currentNetwork;
    }

    public getCurrentAccount(): string | null
    {
        return this.currentAccount;
    }

    private attachEvents()
    {
        if (typeof ethereum !== 'undefined')
        {
            ethereum.on('accountsChanged', (accounts: Array<string>): void =>
            {
                this.handleAccountsChanged(accounts);
            });
            ethereum.on('chainChanged', (chainID: string): void =>
            {
                this.handleNetworkChanged(parseInt(chainID));
            });
            ethereum.on('message', (message: ProviderMessage): void =>
            {
                console.log('received message', message);
            });
            ethereum.on('connect', (connectInfo: ConnectInfo) =>
            {
                console.log('ethereum connect event', connectInfo);
            });
            ethereum.on('disconnect', (error: ProviderRpcError) =>
            {
                console.log('ethereum disconnect event', error);
            });
        }
    }

    public async requestAccounts(): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            ethereum.request({
                method: 'eth_requestAccounts'
            }).then((accounts: string[]) =>
            {
                if (accounts.length > 0)
                {
                    this.currentAccount = accounts[0];
                    resolve(true);
                }
                resolve(false);
            }).catch((error: Error) =>
            {
                console.log(error);
                resolve(false);
            });
        });
    }

    private handleAccountsChanged(accounts: string[]): void
    {
        if (this.currentAccount !== accounts[0])
        {
            this.currentAccount = accounts[0];
            if (typeof this.currentAccount === 'undefined')
            {
                this.state = MetaMaskConnector.STATE_NOT_CONNECTED;
            }
            else
            {
                this.state = MetaMaskConnector.STATE_CONNECTED;
            }
            this.listeners.forEach((l) =>
            {
                l.handleAccountChangedEvent(this.currentAccount);
            });
        }
    }

    private handleNetworkChanged(chainID: number): void
    {
        if (this.currentNetwork !== chainID)
        {
            this.currentNetwork = chainID;
            this.listeners.forEach((l) =>
            {
                l.handleNetworkChangedEvent(this.currentNetwork);
            });
        }
    }

    public static getNetworkName(chainID: number | null): string
    {
        switch (chainID)
        {
            case 1:
                return 'Ethereum Mainnet';
            case 3:
                return 'Ropsten Testnet';
            case 4:
                return 'Rinkeby Testnet';
            case 5:
                return 'Goerli Testnet';
            case 42:
                return 'Kovan Testnet';
        }
        return 'Unknown';
    }
}

export default MetaMaskConnector;