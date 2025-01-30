async function importExportFunction(): Promise<void> {
    try {
        const products = await getProducts();

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

importExportFunction()
    .then(() => console.log("Import/export process completed"))
    .catch(error => console.error("Unhandled error:", error));
