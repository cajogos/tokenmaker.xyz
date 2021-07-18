import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
    children: JSX.Element
};

const Layout = ({ children }: LayoutProps) =>
{
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <Header />
            <div className="content-wrapper container">{children}</div>
            <Footer />
        </>
    );
};

export default Layout;