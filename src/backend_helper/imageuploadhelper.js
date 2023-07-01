import AWS from "aws-sdk";



const aws_access_key = process.env.REACT_APP_AWS_ACCESS_KEY;
const aws_secret_key = process.env.REACT_APP_AWS_SECRET_KEY;

AWS.config.update({
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_key,
    region: 'us-east-1',
  });


  export const s3UploadUrl = async (image) => {
    
    console.log(image);
    const s3 = new AWS.S3();
    if (!image) {
        alert("please choose an image");
        return;
      }
      const params = { 
        Bucket: 'onlineschool-files', 
        Key: `${Date.now()}.${image.name}`, 
        Body: image,
        ContentType: image.type
      };
      const { Location } = await s3.upload(params).promise();
      

      
      console.log('uploaded to s3', Location);
      return Location;

}