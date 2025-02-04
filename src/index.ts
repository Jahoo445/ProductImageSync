import {config} from "dotenv";
import getPicture from "./functions/getPicture";
import getProducts from "./functions/getProducts";
import getProductInfo from "./functions/getProductInfo";
import getPictureLink from "./functions/getPictureLink";
import uploadPicture from "./functions/uploadPicture";
import setPicture from "./functions/setPicture";
import deleteFile from "./functions/deleteFile";
import {writeFile, mkdir, readFile} from "fs/promises";

config();

let processedCount = 0;
let totalDuration = 0;
let productsSucessfullyProcessed = []
let productsFailedToProcess = []

async function processProduct(product: Product): Promise<void> {
    const startTime = performance.now();
    try {
        const productInfo = await getProductInfo(parseInt(product.Id));

        if (!productInfo.lists.Barcodes) {
            console.warn(`No barcode found for product: ${product.Id}`);
            productsSucessfullyProcessed.push(product.Id);
            return;
        }

        for (const barcode of productInfo.lists.Barcodes) {
            const link = await getPictureLink(barcode.Barcode);

            if (link === '404') {
                continue;
            }

            const pictureTitle = productInfo.properties.Title.trim().replace(/\s+/g, '').replace(/[.'\/*]/g, '-').toLowerCase();

            const response = await getPicture(link, pictureTitle);

            if (response === '404') {
                console.warn(`Picture not found for product: ${product.Id}`);
                continue;
            }

            const uploadResponse = await uploadPicture(pictureTitle);
            await setPicture(uploadResponse.apiPath, parseInt(product.Id));

            await deleteFile(pictureTitle);

            break;
        }
        productsSucessfullyProcessed.push(product.Id);
    } catch (error) {
        console.error(`Error processing product: ${product.Id}`, error);
        productsFailedToProcess.push(product.Id);
    } finally {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        totalDuration += duration;
        processedCount++;
        console.log(`Finished processing product ${product.Id}. Duration: ${duration.toFixed(2)}s. Total processed: ${processedCount}`);
    }
}

async function importExportFunction(): Promise<void> {
    const startTime = performance.now();
    try {
        if (await readFile('logs/successfullyProcessedProducts.json', {encoding: 'utf-8'})) {
            productsSucessfullyProcessed = JSON.parse(await readFile('logs/successfullyProcessedProducts.json', {encoding: 'utf-8'}));
        } else {
            productsSucessfullyProcessed = [];
        }

        if (await readFile('logs/failedToProcessProducts.json', {encoding: 'utf-8'})) {
            productsFailedToProcess = JSON.parse(await readFile('logs/failedToProcessProducts.json', {encoding: 'utf-8'}));
        } else {
            productsFailedToProcess = [];
        }

        const productCount = await getProducts(1).then(response => response.info.numberOfItems);

        const productsResponse = await getProducts(productCount);

        const products = productsResponse.data;

        const maxWorkers = 2;
        const productBatches: Promise<void>[] = [];

        for (const product of products) {
            if (productsSucessfullyProcessed.includes(product.Id)) {
                console.warn(`Product ${product.Id} already processed. Skipping...`);
                continue;
            }

            productBatches.push(processProduct(product));

            if (productBatches.length >= maxWorkers) {
                await Promise.all(productBatches);
                productBatches.length = 0;
            }
        }

        await Promise.all(productBatches);

        for (const product of products) {
            if (productsFailedToProcess.includes(product.Id)) {
                console.warn(`Product ${product.Id} failed to process. Retrying...`);
                productBatches.push(processProduct(product));
            }
        }

        await Promise.all(productBatches);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        console.log(`Import/export process completed. Total products processed: ${processedCount}`);
        console.log(`Total processing time: ${duration.toFixed(2)}s`);
        console.log(`Average time per product: ${(totalDuration / processedCount).toFixed(2)}s`);

        if (productsSucessfullyProcessed.length > 0) {
            await mkdir('logs', {recursive: true});

            const logFile = `logs/successfullyProcessedProducts.json`;

            const uniqueProducts = [...new Set(productsSucessfullyProcessed)];

            await writeFile(logFile, JSON.stringify(uniqueProducts.sort((a: string, b: string) => Number(a) - Number(b)), null, 2));
        }

        productsSucessfullyProcessed.forEach(product => {
            if (productsFailedToProcess.includes(product)) {
                productsFailedToProcess.splice(productsFailedToProcess.indexOf(product), 1);
            }
        });

        if (productsFailedToProcess.length > 0) {
            await mkdir('logs', {recursive: true});

            const logFile = `logs/failedToProcessProducts.json`;

            const uniqueProducts = [...new Set(productsFailedToProcess)];

            await writeFile(logFile, JSON.stringify(uniqueProducts.sort((a: string, b: string) => Number(a) - Number(b)), null, 2));
        } else {
            await writeFile('logs/failedToProcessProducts.json', JSON.stringify([]));
        }
    }
}

importExportFunction()
    .catch(error => console.error("Unhandled error:", error));
