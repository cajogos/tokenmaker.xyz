// Styles
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/main.scss';

import Head from 'next/head';
import Layout from '../components/Layout'

const MyApp = ({ Component, pageProps }) =>
{
    return (
        <>
            <Head>
                <title>Tokenmaker.xyz</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
};

export default MyApp;
