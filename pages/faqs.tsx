import { useEffect } from 'react';
import Head from 'next/head';
import faqsData from '../data/faqs.json';

type FAQs = {
    question: string;
    answer: string;
}[];

type FAQsPageProps = {
    faqs: FAQs;
};

// The FAQs page
const FAQsPage = ({ faqs }: FAQsPageProps) =>
{
    useEffect(() =>
    {
        // This call is required to be able to use Bootstrap's Accordion on the page
        typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
    }, []);

    return (
        <>
            <Head>
                <title>FAQs | TokenMaker</title>
            </Head>
            <h1>Frequently Asked Questions (FAQs)</h1>
            <p>These are some of the mostly asked questions for users of TokenMaker. The list grows as needed.</p>
            <div className="accordion" id="faqsAccordion">
                {faqs.map((question, index) =>
                {
                    let accordionId = `faqsaccordion${index}`;
                    return (
                        <div className="accordion-item" key={accordionId}>
                            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                <button className="accordion-button collapsed" type="button"
                                    data-bs-toggle="collapse" data-bs-target={"#" + accordionId}
                                    aria-expanded="false">
                                    <strong>{question.question}</strong>
                                </button>
                            </h2>
                            <div id={accordionId} className="accordion-collapse collapse">
                                <div className="accordion-body">
                                    {question.answer}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

// Load the FAQs from a given JSON file
export async function getStaticProps()
{
    return { props: { faqs: faqsData.faqs } };
}

export default FAQsPage;