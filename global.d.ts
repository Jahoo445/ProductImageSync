import {getProductsResponseType} from "./src/types/getProductsResponse.type";
import {getProductInfoResponse} from "./src/types/getProductInfoResponse.type";
import {uploadResponse} from "./src/types/uploadResponse.type";

export {};

declare global {
    type GetProductsResponse = getProductsResponseType;
    type ProductInfo = getProductInfoResponse;
    type UploadResponse = uploadResponse;
}
