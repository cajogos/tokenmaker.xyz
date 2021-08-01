import Head from 'next/head';
import remark from 'remark';
import html from 'remark-html';
import MarkdownParser from '../classes/MarkdownParser';

type TutorialPageProps = {
    tutorial: string;
};

const TutorialPage = ({ tutorial }: TutorialPageProps) =>
{
    return (
        <>
            <Head>
                <title>How to create your own ERC20 Token | TokenMaker.xyz</title>
            </Head>
            <div dangerouslySetInnerHTML={{ __html: tutorial }} />
        </>
    );
};

export async function getStaticProps()
{
    const content = await MarkdownParser.parse('tutorial');
    return {
        props: {
            tutorial: content
        }
    };
};

export default TutorialPage;