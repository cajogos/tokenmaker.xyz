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

            // TODO: Check if connected
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

    private handleAccountsChanged(accounts: string[]): void
    {
        // TODO: Tell listeners
        console.log('accounts changed', accounts);
    }

    private handleNetworkChanged(chainID: number): void
    {
        // TODO: Tell listeners
        console.log('network changed', chainID);
    }

    public static getNetworkName(chainID: number): string
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