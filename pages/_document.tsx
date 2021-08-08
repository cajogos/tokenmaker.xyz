import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

// This class allows for a custom document object in Next.js
class MyDocument extends Document
{
    static async getInitialProps(ctx: DocumentContext)
    {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render()
    {
        return (
            <Html lang="en">
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
