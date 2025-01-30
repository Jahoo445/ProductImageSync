export default async function getProductInfo(productId: number): Promise<ProductInfo> {
    const url = `${process.env.APIURL}/api/vme/viewmodel/data/detail/MdmProducts/${productId}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.APIKEY}`,
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json() as ProductInfo;
}