import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import MetaMaskConnector from '../classes/MetaMaskConnector';
import CreateForm from '../components/create/CreateForm';
import CreateTokenDetails from '../components/create/TokenDetails';
import CreatePageController from '../controllers/CreatePageController';
import ICreatePageListener from '../interfaces/ICreatePageListener';

type CreatePageProps = {};
type CreatePageState = {
    walletInstalled: boolean;
    pageDisabled: boolean;
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
            pageDisabled: true
        };

        this.manager = new CreatePageController();
        this.manager.addListener(this);
    }

    public onContractCompiled(): void
    {
        console.log('contract compiled CreatePage');
    }

    public onContractDeployed(): void
    {
        console.log('contract deployed CreatePage');
    }

    public onContractChanged(): void
    {
        console.log('contract changed CreatePage');
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
                    <div className="row">
                        <div className="col-md-6">
                            <CreateForm pageManager={this.manager} />
                        </div>
                        <div className="col-md-6 mt-3">
                            <CreateTokenDetails pageManager={this.manager} />
                        </div>
                    </div>
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