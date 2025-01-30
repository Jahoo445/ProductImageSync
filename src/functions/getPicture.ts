import {writeFile, mkdir} from "fs/promises";

export default async function getPicture(link: string, filename: string): Promise<void> {
    const response = await fetch(link, {method: "GET"});

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    await mkdir('pictures', {recursive: true});

    await writeFile(`pictures/${filename}.png`, buffer);
}