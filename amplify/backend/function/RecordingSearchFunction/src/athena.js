const AWS = require('aws-sdk');
if(process.env.IsLocal == 'Yes'){
  AWS.config.update({ region: 'ap-northeast-1' });
  AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'local-admin' });
}

class Athena {

  constructor(outputLocation, waitMsec){
    this.outputLocation = outputLocation;
    this.waitMsec = waitMsec;
    this.athena = new AWS.Athena({apiVersion: '2017-05-18'});
  }

  async query(sql){
    const queryExecutionId = await this.startQuery(sql);
    if(await this.waitQueryEnd(queryExecutionId)){
    const response = await this.athena.getQueryResults({ QueryExecutionId: queryExecutionId }).promise();
    return response['ResultSet']['Rows'].filter((_d,i) => (i!=0)); // 1行目はヘッダ情報なので読み飛ばす 
    }
    return undefined;
  }

  async startQuery(sql) {
    const params = {
    QueryString: sql,
    ResultConfiguration: {
      OutputLocation: this.outputLocation
    }
    };
    const result = await this.athena.startQueryExecution(params).promise();
    return result.QueryExecutionId;
  }

  async waitQueryEnd(queryExecutionId) {
    var params = { QueryExecutionId: queryExecutionId };    
    
    for(var i=0; i < this.waitMsec/500; i++) { 
    const result = await this.athena.getQueryExecution(params).promise();
    console.log('Status : ', result.QueryExecution.Status.State);
    if (result.QueryExecution.Status.State == 'SUCCEEDED') {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    }
    return false;
  }
}
module.exports = Athena;
