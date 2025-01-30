async function importExportFunction(): Promise<void> {
    try {
        const products = await getProducts();

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

importExportFunction();
