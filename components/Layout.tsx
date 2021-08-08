import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
    children: JSX.Element
};

// This is the main layout used throughout the application
const Layout = ({ children }: LayoutProps) =>
{
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta name="robots" content="noindex" />
            </Head>
            <Header />
            <div className="content-wrapper container">{children}</div>
            <Footer />
        </>
    );
};

export default Layout;