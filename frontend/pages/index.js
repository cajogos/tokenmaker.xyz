import Link from 'next/link';

const HomePage = () =>
{
    return (
        <div className="text-center p-4">
            <h1>Tokenmaker.xyz</h1>
            <p>Create your own token within minutes!</p>
            <Link href="/create">
                <a className="btn btn-primary">Create Your Token</a>
            </Link>
        </div>
    );
};

export default HomePage;