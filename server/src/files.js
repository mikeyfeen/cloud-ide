import fs from 'fs';
import path from 'path';
// import { uploadFile } from './cloud';

const fetchDir = async (dirPath, dir) => {
    const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
    const contents = await Promise.all(files.map(async (file) => {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
            const children = await fetchDir(filePath, file.name);
            return {
                name: file.name,
                children,
            };
        } else {
            return {
                name: file.name,
            };
        }
    }));
    return contents;
}

const fetchFileContent = async (filePath) => {
    const data= await fs.promises.readFile(filePath, 'utf-8');
    return data;
}

const saveFile = async (filePath, content) => {
    await fs.promises.writeFile(filePath, content, 'utf-8');
    //add buffer
    var fileStream = fs.createReadStream(filePath);

    // uploadFile(path.basename(filePath), fileStream);

}



export { fetchDir, fetchFileContent, saveFile };

