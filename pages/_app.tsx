import type { AppProps } from 'next/app';
import Head from 'next/head';

// Components
import Layout from '../components/Layout'

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/main.scss';

// This is the main Next.js app file
const MyApp = ({ Component, pageProps }: AppProps) =>
{
    return (
        <>
            <Head>
                <title>TokenMaker</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
};

export default MyApp;
