import {config} from "dotenv";
import getPicture from "./functions/getPicture";
import getProducts from "./functions/getProducts";
import getProductInfo from "./functions/getProductInfo";
import getPictureLink from "./functions/getPictureLink";
import uploadPicture from "./functions/uploadPicture";
import setPicture from "./functions/setPicture";

config();

async function importExportFunction(): Promise<void> {
    try {
        let productsCount = 0;

        // const productResponse = await getProducts(1);
        //
        // const productsResponse = await getProducts(productResponse.info.numberOfItems);

        const productsResponse = await getProducts(10);

        const products = productsResponse.data;

        for (const product of products) {
            try {
                console.log('product count is:', productsCount + 1);

                const productInfo = await getProductInfo(parseInt(product.Id))

                if (!productInfo.lists.Barcodes) {
                    console.warn('No barcode found for product:', productInfo.properties.Title);
                    productsCount++;
                    continue;
                }

                for (const barcode of productInfo.lists.Barcodes) {
                    const link = await getPictureLink(barcode.Barcode);

                    if (link === '404') {
                        continue;
                    }
                    const pictureTitle = productInfo.properties.Title.trim().replace(/ /g, '').toLowerCase();

                    await getPicture(link, pictureTitle);

                    const uploadResponse = await uploadPicture(pictureTitle);

                    await setPicture(uploadResponse.apiPath, parseInt(product.Id));

                    break;
                }
                productsCount++;
            } catch (error) {
                console.error(`Error processing product: ${product.Id}`, error);
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

importExportFunction()
    .then(() => console.log("Import/export process completed"))
    .catch(error => console.error("Unhandled error:", error));
