console.log('Hello World!');
const { S3Client, CreateBucketCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
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


const fileName = `${imageId}.txt`;



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
    const myBucketName = 'my-bucket-123456';
    await createBucket(myBucketName);
    await uploadFile(myBucketName, `${uploadPath+fileName}`, 'Hello World! this is Bucket 12345');
};

module.exports = { 
    createBucket,
    uploadFile,
};

main();


// add .gitignore