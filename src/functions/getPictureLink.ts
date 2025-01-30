export default async function getPictureLink(productBarcode: string): Promise<string> {
    const url = `https://migrolino.paloma.one/pictures/article/${productBarcode}/public-images`

    const response = await fetch(url, {
        method: "GET"
    });

    if (response.status === 404) {
        console.warn('No picture found for barcode:', productBarcode);
        return '404';
    } else if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const htmlText = await response.text();

    return extractFirstWebSmallImageUrl(htmlText);
}


function extractFirstWebSmallImageUrl(html: string): string {
    const match = html.match(/<a\s+href="([^"]+type=web_small)"/);
    if (!match) {
        throw Error('No match found');
    }

    return match[1];
}