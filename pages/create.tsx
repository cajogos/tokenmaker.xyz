import React from 'react';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import MetaMaskConnector from '../classes/MetaMaskConnector';
import CreateForm from '../components/create/CreateForm';
import CreateTokenDetails from '../components/create/TokenDetails';
import CreatePageController from '../controllers/CreatePageController';
import ICreatePageListener from '../interfaces/ICreatePageListener';

type CreatePageProps = {};
type CreatePageState = {
    walletInstalled: boolean;
    pageDisabled: boolean;
    lastEvent: 'None' | 'Contract Changed' | 'Contract Compiled' | 'Contract Compilation Error' | 'Contract Deployed'
};

class CreatePage extends React.Component<CreatePageProps, CreatePageState>
    implements ICreatePageListener
{
    private manager: CreatePageController;

    constructor(props: CreatePageProps)
    {
        super(props);
        this.state = {
            walletInstalled: false,
            pageDisabled: true,
            lastEvent: 'None'
        };

        this.manager = new CreatePageController();
        this.manager.addListener(this);
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

    componentDidMount()
    {
        let pageShouldBeDisabled = true;
        if (MetaMaskConnector.getState() === MetaMaskConnector.STATE_CONNECTED)
        {
            pageShouldBeDisabled = false;
        }
        this.setState({
            walletInstalled: MetaMaskConnector.getState() !== MetaMaskConnector.STATE_NOT_INSTALLED,
            pageDisabled: pageShouldBeDisabled
        });
    }

    render()
    {
        return (
            <>
                <h2>Create your Token</h2>
                {this.state.walletInstalled && !this.state.pageDisabled ?
                    <>
                        <p className="alert alert-secondary small">
                            <span><FaInfoCircle /> <strong>Last Event:</strong> {this.state.lastEvent}</span>
                        </p>
                        <div className="row">
                            <div className="col-md-6">
                                <CreateForm pageManager={this.manager} />
                            </div>
                            <div className="col-md-6 mt-3">
                                <CreateTokenDetails pageManager={this.manager} />
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