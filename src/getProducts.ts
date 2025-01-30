async function getProducts(): Promise<GetProductsResponse> {
    const url = "https://business.dev.cirrusoft.ch/api/vme/viewmodel/data/list/MdmProducts?api-version=1.0&asc=true&pageSize=33184";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json() as GetProductsResponse;
        console.log(data);

        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Ensure errors propagate
    }
}
