import {writeFile, mkdir} from "fs/promises";

export default async function getPicture(link: string, filename: string): Promise<void | '404'> {
    const response = await fetch(link, {method: "GET"});

    if (response.status === 404) {
        return '404';
    }

    if (!response.ok) {
        const data = await response.json();

        const code = await getPicture(data.message, filename);

        if (code === '404') {
            return '404';
        }

        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    await mkdir('pictures', {recursive: true});

    await writeFile(`pictures/${filename}.png`, buffer);
}