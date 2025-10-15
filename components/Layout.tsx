import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import Disclaimer from './Disclaimer';

type LayoutProps = {
    children: React.ReactNode
};

// This is the main layout used throughout the application
const Layout = ({ children }: LayoutProps) =>
{
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Disclaimer />
            <div className="content-wrapper container">{children}</div>
            <Footer />
        </>
    );
};

export default Layout;