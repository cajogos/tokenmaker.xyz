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
        MetaMaskConnector.getInstance().listeners.push(listener);
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
        // Checks the current state of MetaMask and assigns it to the state variable
        this.state = MetaMaskConnector.STATE_NOT_INSTALLED;
        if (typeof ethereum !== 'undefined')
        {
            this.state = MetaMaskConnector.STATE_NOT_CONNECTED;

            // Loading the chain ID is an asynchronous process - can be done in parallel
            this.loadChainID();

            // Get the current account from MetaMask and if it's not null then we are connected
            this.currentAccount = ethereum.selectedAddress;
            if (ethereum.isConnected() && this.currentAccount !== null)
            {
                this.state = MetaMaskConnector.STATE_CONNECTED;
            }
        }
    }

    private loadChainID()
    {
        ethereum.request({ method: 'eth_chainId' })
            .then((chainID: string) =>
                this.fireNetworkChangedEvent(parseInt(chainID, 16))
            )
            .catch(error => console.error(error));
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
            // Event to check when account is changed
            ethereum.on('accountsChanged',
                (accounts: Array<string>): void => this.fireAccountsChangedEvent(accounts)
            );

            // Event to check when the chain ID is changed
            ethereum.on('chainChanged',
                (chainID: string): void => this.fireNetworkChangedEvent(parseInt(chainID, 16))
            );

            // Extra events for MetaMask - could be used in the future
            ethereum.on('message', (message: ProviderMessage): void => console.log('message', message));
            ethereum.on('connect', (connectInfo: ConnectInfo) => console.log('connect', connectInfo));
            ethereum.on('disconnect', (error: ProviderRpcError) => console.log('disconnect', error));
        }
    }

    public async requestAccounts(): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            // This will request the accounts from MetaMask - triggering a connection to the wallet
            ethereum.request({ method: 'eth_requestAccounts' })
                .then((accounts: string[]) =>
                {
                    if (accounts.length > 0)
                    {
                        // If accounts are returned then fire the event
                        this.fireAccountsChangedEvent(accounts);
                        resolve(true);
                    }
                    resolve(false);
                })
                .catch((error: Error) => resolve(false));
        });
    }

    private fireAccountsChangedEvent(accounts: string[]): void
    {
        if (this.currentAccount !== accounts[0])
        {
            this.currentAccount = accounts[0];
            // Determine if the wallet is connected by the account received (undefined means not connected)
            this.state = (typeof this.currentAccount === 'undefined') ?
                MetaMaskConnector.STATE_NOT_CONNECTED : MetaMaskConnector.STATE_CONNECTED;

            // Tell the listeners the account has changed
            this.listeners.forEach((listener: IMetaMaskListener) =>
                listener.onAccountChanged(this.currentAccount)
            );
        }
    }

    private fireNetworkChangedEvent(chainID: number): void
    {
        if (this.currentNetwork !== chainID)
        {
            this.currentNetwork = chainID;

            // Tell the listeners the network has changed
            this.listeners.forEach((listener: IMetaMaskListener) =>
                listener.onNetworkChanged(this.currentNetwork)
            );
        }
    }

    public static getNetworkName(chainID: number | null): string
    {
        switch (chainID)
        {
            case 1: return 'Ethereum Mainnet';
            case 3: return 'Ropsten Testnet';
            case 4: return 'Rinkeby Testnet';
            case 5: return 'Goerli Testnet';
            case 42: return 'Kovan Testnet';
            // Arbitrary value used for testnet Ganache
            case 1337: return 'Local Testnet';
        }
        return 'Unknown';
    }

    public static async addTokenToWallet(params: TokenWalletParams): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            // This will call MetaMask to add the token to the wallet
            ethereum.request({ method: 'wallet_watchAsset', params })
                .then((result: boolean) => resolve(result))
                .catch(error => console.error(error));
        });
    }
}

export default MetaMaskConnector;