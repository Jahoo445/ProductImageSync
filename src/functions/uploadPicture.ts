import * as fs from "fs/promises";

export default async function uploadPicture(filename: string): Promise<UploadResponse> {
    const apiUrl = `${process.env.APIURL}/api/img/upload`;
    const filePath = `pictures/${filename}.png`;

    try {
        const fileBuffer = await fs.readFile(filePath);

        const formData = new FormData();
        const blob = new Blob([fileBuffer], {type: "image/png"});
        formData.append("file", blob, filename);

        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${process.env.APIKEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
        }

        const responseBody = await response.json();

        console.log(`Image ${filename}.png uploaded successfully!`);

        console.log(responseBody);

        return responseBody as UploadResponse;
    } catch (error) {
        throw new Error(`Error uploading file: ${(error as Error).message}`);
    }
}
