const AWS = require('aws-sdk');
if(process.env.IsLocal == 'Yes'){
  AWS.config.update({ region: 'ap-northeast-1' });
  AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'local-admin' });
}

exports.getSignedUrl = function(url){
  const s3 = new AWS.S3({signatureVersion: 's3v4'}); // AWS KMSで暗号化されている

  const tmp = url.split('/');
  const bucket = tmp[0]; 
  let key = `${url.replace(tmp[0],'')}`;
  key = key.slice(1);
  return s3.getSignedUrl('getObject', {Bucket: bucket, Key: key});
}

exports.getObject = async function(url){
  const s3 = new AWS.S3();

  const tmp = url.split('/');
  const bucket = tmp[0]; 
  let key = `${url.replace(tmp[0],'')}`;
  key = key.slice(1);
  return await s3.getObject({Bucket: bucket, Key: key}).promise();
}