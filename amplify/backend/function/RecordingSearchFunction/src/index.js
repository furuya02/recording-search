const Ctr = require('./ctr');
const s3 = require('./s3');

function getParams(bodyString){
  const body = JSON.parse(bodyString);
  const params = {};
  const keys = ['date', 'hour', 'initiationMethod', 'channel', 'queue', 'agentName', 'url', 'user'];
  keys.forEach(key =>{
    params[key] = (body[key]=='')?undefined:body[key];
  })

  if(params['date']){
    const [year, month, day] = params['date'].split('-');
    params['year'] = parseInt(year);
    params['month'] = parseInt(month);
    params['day'] = parseInt(day);
    if(params['hour']){
      params['hour'] = parseInt(params['hour']);
    }
  }

  return params;
}

exports.handler = async (event) => {

  console.log(JSON.stringify(event));
  
  const params = getParams(event['body']);
  console.log(params);

  let body = {};
  let statusCode = 403;

  if(event['httpMethod'] === 'POST'){
    if(event["path"] == "/recording/list"){
      const ctr = new Ctr();
      body = await ctr.query(params);
      statusCode = 200;
    }else if(event["path"] == "/recording/audio"){
      statusCode = 200;
      const audioSrc = s3.getSignedUrl(params.url)
      body = {
        "audioSrc": audioSrc
      }
      // const blob = await s3.getObject(params.url);
      // body = {
      //   "blob": blob.Body
      // }
    }
  }

  console.log(`body: ${JSON.stringify(body)}`)
  const response = {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    }, 
    body: JSON.stringify(body),
  };
  return response;
};

