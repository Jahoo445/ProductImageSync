import {getProductsResponseType} from "./types/getProductsResponseType";

async function getProducts(): Promise<getProductsResponseType> {
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

        const data = await response.json() as getProductsResponseType;
        console.log(data);

        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}



