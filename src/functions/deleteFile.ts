import {promises as fs} from "fs";

export default async function deleteFile(filename: string): Promise<void> {
    const path = `pictures/${filename}.png`;

    try {
        await fs.unlink(path);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            console.warn(`File ${path} does not exist.`);
        } else {
            console.error(`Error deleting file ${path}:`, error);
            throw error;
        }
    }
}
