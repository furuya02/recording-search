const Athena = require('./athena');

class Ctr {
  constructor(){

    const outputLocation = 's3://amazon-connect-ctr-athena-query-results-20220111/';
    const waitMsec = 15000; // 15秒まで待機
    this.athena = new Athena(outputLocation,waitMsec);

    // SQL生成
    this.columns = [
      ["ConnectedTimestamp","ConnectedToSystemTimestamp"],
      ["DisconnectTimestamp","DisconnectTimestamp"],
      ["InitiationMethod","InitiationMethod"],
      ["Channel","Channel"],
      ["ContactId","ContactId"],
      ["Queue","json_extract(Queue, '$.name')"],
      ["AgentName","json_extract(Agent, '$.username')"],
      ["RecordingLocation","json_extract(Recording, '$.location')"],
      ["CustomerEndpoint","json_extract(CustomerEndpoint, '$.address')"],
      ["SystemEndpoint","json_extract(SystemEndpoint, '$.address')"],
    ]
    this.limit = 300;
    this.tableName = 'default.ctr_table';
  }

  async query(params){
    //SQL作成    
    const year = params['year'];
    const month = params['month'];
    const day = params['day'];
    const hour = params['hour'];    
    const initiationMethod = params['initiationMethod'];    
    const channel = params['channel'];    
    const queue = params['queue'];    
    const agentName = params['agentName'];    
    const sql = this.createSql(year, month, day, hour);
    console.log(`ctr.query sql:${sql}`)
    // クエリ
    const response = await this.athena.query(sql);
    // レスポンスのデコード
    if(response == undefined){
      console.log(`ctr.query faild.`)
      return undefined;
    }
    const data = this.decodeResponse(response);
    console.log(`ctr.query response:${JSON.stringify(data)}`);
    console.log(`ctr.query length:${data.length}`);

    const result = [];
    for(const d of data){
      let isHit = true;
      if(initiationMethod){
        if(d['InitiationMethod'] !== initiationMethod){
          isHit = false;
        }
      }
      if(channel){
        if(d['Channel'] !== channel){
          isHit = false;
        }
      }
      if(queue){
        if(d['Queue'] !== queue){
          isHit = false;
        }
      }
      if(agentName){
        if(d['AgentName'] !== agentName){
          isHit = false;
        }
      }
      if(isHit){
        result.push(d);
      }
    }
    return result;
  }
  
  decodeResponse(response) {
    const resultJsons = []
    for(const row of response){
      const json = {}
      for( var i =0;i<this.columns.length;i++){
        json[this.columns[i][0]] = row['Data'][i].VarCharValue.replace(/"/g,"");
      }
      resultJsons.push(json);
    }
    return resultJsons;
  }
  
  createSql(year, month, day, hour){
    let sql = 'SELECT ';
    for(const [name,value] of this.columns) {
      sql += `${value} as ${name},`;
    }
    sql = sql.slice( 0, -1); // 最後の,を削除
    sql += ` FROM ${this.tableName}`;
    sql += ` WHERE`;
    if(year){
      sql += ` year=${year}`;
    }
    if(month){
      sql += ` and month=${month}`;
    }
    if(day){
      sql += ` and day=${day}`;
    }
    if(hour){
      sql += ` and hour=${hour}`;
    }
    sql +=  ` limit ${this.limit}`;
    return sql;
  }
}
module.exports = Ctr;