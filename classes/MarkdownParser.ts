import remark from 'remark';
import html from 'remark-html';
import fs from 'fs';
import path from 'path';

class MarkdownParser
{
    public static async parse(fileName: string): Promise<string>
    {
        const fileContents = await MarkdownParser.getFileContent(fileName);
        const result = await remark().use(html).process(fileContents);
        return result.toString();
    }

    private static async getFileContent(fileName: string): Promise<string>
    {
        const markdownDir = path.resolve(process.env.projectRoot + '/markdown');
        const filePath = `${markdownDir}/${fileName}.md`;
        return fs.readFileSync(filePath).toString();
    }
}

export default MarkdownParser;