import CreateForm from '../components/CreateForm';
import CreateTokenDetails from '../components/CreateTokenDetails';

const CreatePage = () =>
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
};

export default CreatePage;