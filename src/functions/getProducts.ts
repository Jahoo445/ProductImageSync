export default async function getProducts(pageSize: number): Promise<GetProductsResponse> {
    const url = `${process.env.APIURL}/api/vme/viewmodel/data/list/MdmProducts?api-version=1.0&asc=true&pageSize=${pageSize}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.APIKEY}`,
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json() as GetProductsResponse;
}
