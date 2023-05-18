console.log('Hello World!');
const { S3Client, CreateBucketCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require('axios');
require('dotenv').config();



// upload path
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const hour = date.getHours();
const minute = date.getMinutes();
const ranDomNumber = Math.floor(Math.random() * (9999999 - 1000));
const imageId = 1;

//
const myBucketName = 'niceone';


const fileName = `${imageId}`;

// --------------------- download file



async function downloadFile(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
}


// --- Get file extension

async function getFileExtension(file) {
    const mimeType = file.slice(0, 4).toString('hex');
    let extension = '';
  
    if (mimeType === '25504446') {
      extension = 'pdf';
    } else if (mimeType === '47494638') {
      extension = 'gif';
    } else if (mimeType === '89504e47') {
      extension = 'png';
    } else if (mimeType === 'ffd8ffe0' || mimeType === 'ffd8ffe1' || mimeType === 'ffd8ffe2') {
      extension = 'jpg';
    }
  
    return extension;
  }

// ---------------------



const uploadPath = `files/posts/images/${year}/${month}/${day}/${hour}/${minute}/${ranDomNumber}/`;


const s3 = new S3Client({
    region: process.env.R2_REGION,
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY
    },
});

const createBucket = async (bucketName) => {
    console.log(`Creating bucket: ${bucketName}`);
    const command = new CreateBucketCommand({
        Bucket: bucketName,
    });
    try {
        const { Location } = await s3.send(command);
        console.log(`Bucket ${bucketName} created at ${Location}`);
    }
    catch (err) {
        if (err.name === 'BucketAlreadyExists') {
            console.log(`Bucket ${bucketName} already exists`);
        }
        else {
            console.log("Error", err);
        }
    }
};

const uploadFile = async (bucketName, fileName, fileContent) => {
    console.log(`Uploading file: ${fileName} to bucket: ${bucketName}`);
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
    });
    try {
        const { ETag, Location } = await s3.send(command);
        console.log(`File uploaded successfully at ${Location}`);
    }
    catch (err) {
        console.log("Error", err);
    }
};

// '2023/05/my-file.txt'
const main = async () => {
    let fileExtension;
    let fileContent;

    await downloadFile('https://firebasestorage.googleapis.com/v0/b/filterlightroom1.appspot.com/o/app%2Fimages%2F2023%2F1%2F1672987664783251%D9%A2%D9%A0%D9%A2%D9%A3%D9%A0%D9%A1%D9%A0%D9%A6_%D9%A0%D9%A9%D9%A4%D9%A7%D9%A4%D9%A1.jpg?alt=media&token=14e0151d-ea72-43e9-92ad-2e72a0960189')
        .then((fileData) => {
            fileContent = fileData;  
            // Use the fileData variable to upload it to S3 or perform any other operations
            console.log('File downloaded successfully:', fileData);
            console.log(fileContent);
        })
        .catch((error) => {
            console.error('Error downloading file:', error);
        });
     fileExtension = await getFileExtension(fileContent);

    // await createBucket(myBucketName);
    await uploadFile(myBucketName, `${uploadPath + fileName}.${fileExtension}`, fileContent);

};

module.exports = {
    createBucket,
    uploadFile,
};

main();


// add .gitignore