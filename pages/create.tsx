import React from 'react';
import CreateForm from '../components/CreateForm';
import CreateTokenDetails from '../components/CreateTokenDetails';

type CreatePageProps = {};
type CreatePageState = {};

class CreatePage extends React.Component<CreatePageProps, CreatePageState>
{
    constructor(props: CreatePageProps)
    {
        super(props)
    }

    render()
    {
        return (
            <>
                <h1>Create your Token</h1>
                <div className="row">
                    <div className="col">
                        <CreateForm />
                    </div>
                    <div className="col">
                        <CreateTokenDetails />
                    </div>
                </div>
            </>
        );
    }
};

export default CreatePage;