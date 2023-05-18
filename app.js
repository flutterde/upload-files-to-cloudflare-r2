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
const imageId = 001;

//
const myBucketName = 'niceone';


const fileName = `${imageId}.pdf`;

// ---------------------



async function downloadFile(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
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
    let fileContent;

    await downloadFile('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
        .then((fileData) => {
            fileContent = fileData;
            // Use the fileData variable to upload it to S3 or perform any other operations
            console.log('File downloaded successfully:', fileData);
        })
        .catch((error) => {
            console.error('Error downloading file:', error);
        });

    // await createBucket(myBucketName);
    await uploadFile(myBucketName, `${uploadPath + fileName}`, fileContent);
};

module.exports = {
    createBucket,
    uploadFile,
};

main();


// add .gitignore