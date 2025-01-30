export default async function setPicture(pictureApiPath: string, productId: number): Promise<void> {
    const url = `${process.env.APIURL}/api/mdm/products/${productId}/image`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${process.env.APIKEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "url": pictureApiPath
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log(`Picture set for product: ${productId}`);

    return;
}