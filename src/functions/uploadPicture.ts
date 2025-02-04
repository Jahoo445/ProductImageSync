import * as fs from "fs/promises";

export default async function uploadPicture(filename: string): Promise<UploadResponse> {
    const apiUrl = `${process.env.APIURL}/api/img/upload`;
    const filePath = `pictures/${filename}.png`;

    const fileBuffer = await fs.readFile(filePath);

    const formData = new FormData();
    const blob = new Blob([fileBuffer], {type: "image/png"});
    formData.append("file", blob, filename + '.png');

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

    return responseBody as UploadResponse;

}
