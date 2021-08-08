import React from 'react';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import MetaMaskConnector from '../classes/MetaMaskConnector';
import CreateForm from '../components/create/CreateForm';
import CreateTokenDetails from '../components/create/TokenDetails';
import CreatePageController from '../controllers/CreatePageController';
import ICreatePageListener from '../interfaces/ICreatePageListener';
import IMetaMaskListener from '../interfaces/IMetaMaskListener';
import Head from 'next/head';

type CreatePageProps = {};
type CreatePageState = {
    walletInstalled: boolean;
    walletConnected: boolean;
    pageDisabled: boolean;
    lastEvent: 'None' | 'Contract Changed' | 'Contract Compiled' | 'Contract Compilation Error' | 'Contract Deployed';
};

class CreatePage extends React.Component<CreatePageProps, CreatePageState>
    implements ICreatePageListener, IMetaMaskListener
{
    private manager: CreatePageController;

    constructor(props: CreatePageProps)
    {
        super(props);
        this.state = {
            walletInstalled: false,
            walletConnected: false,
            pageDisabled: true,
            lastEvent: 'None'
        };

        this.manager = new CreatePageController();
        this.manager.addListener(this);

        MetaMaskConnector.addListener(this);
    }

    public onPageEnabled(isEnabled: boolean): void { }

    public handleAccountChangedEvent(account: string | null): void
    {
        this.checkWalletState();
    }

    public handleNetworkChangedEvent(network: number | null): void
    {
        this.checkWalletState();
    }

    public onContractChanged(): void
    {
        this.setState({
            lastEvent: 'Contract Changed'
        });
    }

    public onContractCompiled(): void
    {
        this.setState({
            lastEvent: 'Contract Compiled'
        });
    }

    public onContractCompiledError(errorCode: number, errorMessage: string): void
    {
        this.setState({
            lastEvent: 'Contract Compilation Error'
        });
    }

    public onContractDeployed(): void
    {
        this.setState({
            lastEvent: 'Contract Deployed'
        });
    }

    public componentDidMount()
    {
        this.checkWalletState();
    }

    private checkWalletState()
    {
        let pageShouldBeDisabled = true;
        let walletConnected = false;
        if (MetaMaskConnector.getState() === MetaMaskConnector.STATE_CONNECTED)
        {
            pageShouldBeDisabled = false;
            walletConnected = true;
        }
        this.setState({
            walletInstalled: MetaMaskConnector.getState() !== MetaMaskConnector.STATE_NOT_INSTALLED,
            pageDisabled: pageShouldBeDisabled,
            walletConnected: walletConnected
        });

        this.manager.setEnabled(!pageShouldBeDisabled);
    }

    render()
    {
        return (
            <>
                <Head>
                    <title>Create a Token | TokenMaker</title>
                </Head>
                <h2>Create your Token {this.state.walletInstalled && !this.state.walletConnected ? <span className="badge bg-danger"><FaExclamationTriangle /> Connect Your Wallet</span> : ''}</h2>
                {this.state.walletInstalled ?
                    <>
                        <p className="alert alert-secondary small">
                            <span><FaInfoCircle /> <strong>Last Event:</strong> {this.state.lastEvent}</span>
                        </p>
                        <div className="row">
                            <div className="col-md-6">
                                <CreateForm pageManager={this.manager} disabled={this.state.pageDisabled} />
                            </div>
                            <div className="col-md-6 mt-3">
                                <CreateTokenDetails pageManager={this.manager} disabled={this.state.pageDisabled} />
                            </div>
                        </div>
                    </>
                    :
                    <div className="alert alert-warning">
                        <span><FaExclamationTriangle /> Please install MetaMask!</span>
                    </div>
                }
            </>
        );
    }
};

export default CreatePage;