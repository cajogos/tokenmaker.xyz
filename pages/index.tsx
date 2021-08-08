import Link from 'next/link';

const HomePage = () =>
{
    return (
        <div className="text-center p-4">
            <h1>TokenMaker</h1>
            <p>Create your own token within minutes!</p>
            <div className="my-2 border-bottom border-gray p-2">
                <Link href="/create">
                    <a className="btn btn-lg btn-primary fw-bold mx-2">Create Your Token</a>
                </Link>
            </div>
            <div>
                <Link href="/tutorial">
                    <a className="btn btn-danger mx-2">Learn</a>
                </Link>
                <Link href="/faqs">
                    <a className="btn btn-danger mx-2">FAQs</a>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;