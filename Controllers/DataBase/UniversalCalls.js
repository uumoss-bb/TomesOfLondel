import BasicCRUD from "./BasicCrud"
import dynamoDB from "./dynamoDB_helper"

export default class UniversalCalls extends BasicCRUD{

  constructor(tableName) {
    super(tableName)
    this.tableName = tableName
  }

  async GetData_PK(data, offset, limit) {
    let { PK } = data

    if(!PK) {
      throw new Error(error_no_info)
    }

    let params = {
      TableName: this.tableName,
      IndexName: "GSI_BY_PK",
      KeyConditionExpression: "PK = :PK",
      ExpressionAttributeValues: {
          ":PK": PK
      }
    };
  
    if(offset) {
      params.ExclusiveStartKey = offset
    }
  
    if(limit) {
      params.Limit = limit
    }
    
    try {
      return await dynamoDB("query", params);
    } catch (e) {
      throw new Error(e)
    }
  }

  async GetData_PKandType(data, offset, limit) {
    let { PK, type } = data

    if(!PK || !type) {
      throw new Error(error_no_info)
    }

    let params = {
      TableName: this.tableName,
      IndexName: "GSI_BY_PK_AND_TYPE",
      KeyConditionExpression: "PK = :PK and #type = :type",
      ExpressionAttributeNames: {
        "#type": "type"
      },
      ExpressionAttributeValues: {
          ":PK": PK,
          ":type": type
      }
    };
  
    if(offset) {
      params.ExclusiveStartKey = offset
    }
  
    if(limit) {
      params.Limit = limit
    }

    try {
      return await dynamoDB("query", params);
    } catch (e) {
      throw new Error(e)
    }
  }

  async GetData_SKandType(data, offset, limit) {
    let { SK, type } = data

    if(!SK || !type) {
      throw new Error(error_no_info)
    }

    let params = {
      TableName: this.tableName,
      IndexName: "GSI_BY_SK_AND_TYPE",
      KeyConditionExpression: "SK = :SK and #type = :type",
      ExpressionAttributeNames: {
        "#type": "type"
      },
      ExpressionAttributeValues: {
          ":SK": SK,
          ":type": type
      }
    };
  
    if(offset) {
      params.ExclusiveStartKey = offset
    }
  
    if(limit) {
      params.Limit = limit
    }

    try {
      return await dynamoDB("query", params);
    } catch (e) {
      throw new Error(e)
    }
  }

  async GetData_SK(data, offset, limit) {
    let { SK } = data

    if(!SK) {
      throw new Error(error_no_info)
    }

    let params = {
      TableName: this.tableName,
      IndexName: "GSI_BY_SK",
      KeyConditionExpression: "SK = :SK",
      ExpressionAttributeValues: {
          ":SK": SK
      }
    };
  
    if(offset) {
      params.ExclusiveStartKey = offset
    }
  
    if(limit) {
      params.Limit = limit
    }
    
    try {
      return await dynamoDB("query", params);
    } catch (e) {
      throw new Error(e)
    }
  }

  async GetData_Type(data, offset, limit) {
    let { type } = data

    if(!type) {
      throw new Error(error_no_info)
    }

    let params = {
      TableName: this.tableName,
      IndexName: "GSI_BY_TYPE",
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames: {
        "#type": "type"
      },
      ExpressionAttributeValues: {
          ":type": type
      }
    };
  
    if(offset) {
      params.ExclusiveStartKey = offset
    }
  
    if(limit) {
      params.Limit = Number(limit)
    }

    try {
      return await dynamoDB("query", params);
    } catch (e) {
      throw new Error(e)
    }
  }

  async BatchGetItems(keys) {
    
    if(!keys || keys.length === 0) {
      throw new Error(error_no_info)
    }

    let params = {
      RequestItems: {}, 
    };
    params.RequestItems[this.tableName] = {
      Keys: keys
    }
    try {
      let resp = await dynamoDB("batchGet", params);
      if(resp.Responses[this.tableName].length === 0) {
        throw new Error(error_no_data)
      }
      return resp
    } catch (e) {
      throw new Error(e)
    }
  }

  async BatchGetAllItems(keys) {

    const filterKeys = () => {
      while (keysToGet.length > 100) {
        let overFlow = keysToGet.shift()
        overFlowingKeys.push(overFlow)
      }
    },
    getItems = async () => {
      let Res = await this.BatchGetItems(keysToGet)
      if(Res.Responses[this.tableName]) {
        ItemsCollected = [...ItemsCollected, ...Res.Responses[this.tableName]]
      }
    },
    nextMove = () => {
      let UnprocessedKeys = Res?.UnprocessedKeys?.Keys ?? [],
      isMoreOverFlow = [...overFlowingKeys, ...UnprocessedKeys].length > 0

      if(isMoreOverFlow) {
        keysToGet = [...overFlowingKeys, ...UnprocessedKeys]
        isMoreKeys = keysToGet.length > 0
        overFlowingKeys = []
      } else {
        isMoreKeys = false
      }
    }

    let keysToGet = keys,
    overFlowingKeys = [],
    ItemsCollected = [],
    isMoreKeys = keysToGet.length > 0,
    Res

    while(isMoreKeys) {
      filterKeys()

      await getItems()

      nextMove()
    }

    return ItemsCollected
  }
  
  async Pagination(data, offset, limit, query) {

    let ItemsCollected = [], 
    LastEvaluatedKey = null,
    usePagination = limit, 
    grabEverything = !limit && limit !== 0,
    getData = async (_data, _offset, _limit) => {
      try {
        let resp = await query(_data, _offset, _limit)
        ItemsCollected = [...ItemsCollected, ...resp.Items]
        LastEvaluatedKey = resp.LastEvaluatedKey
        
        if(_limit) {
          limit -=  Number(ItemsCollected.length)
        }
      } catch(e) {
        throw e
      }
    }

    if(usePagination) {
      await getData(data, offset, limit)
    
      let isMoreToGet = LastEvaluatedKey && ItemsCollected.length < limit
      while(isMoreToGet) {
        await getData(data, LastEvaluatedKey, limit)
      }
    } 
    
    if(grabEverything){
      await getData(data, offset, null)
      
      let isMoreToGet = LastEvaluatedKey
      while(isMoreToGet) {
        await getData(data, LastEvaluatedKey, null)
      }
    }

    return { 
      ItemsCollected,
      LastEvaluatedKey,
      newLimit: limit
    }
  }

  //THIS IS ONLY USED FOR DEV DBS
  async DeleteAll() {
    async function getAll(tableName) {
      let params = {
        TableName: tableName
      };
      return await dynamoDB("scan", params)
    }
    async function deleteData(PK, SK, tableName) {
      let params = {
        TableName: tableName,
        ConditionExpression: "PK = :PK and SK = :SK",
        ReturnValues: "ALL_OLD",
        Key: {                
          PK: PK,
          SK: SK
  
        },
        ExpressionAttributeValues: {
            ":PK": PK,
            ":SK": SK
        }
      }; 
      
      try {
        await dynamoDB("delete", params)
      } catch(e) {
        // Do nothing
      }
    }

    let ONLY_FOR_DEV = this.tableName.includes("-dev-")
    if(ONLY_FOR_DEV) {
      let allData = await getAll(this.tableName)
      if(allData.Count > 0) {
        for (let index = 0; index < allData.Items.length; index++) {
          const item = allData.Items[index];
          await deleteData(item.PK, item.SK, this.tableName)
        }
      }
    }
  }
}

const error_no_data = "no data"
const error_no_info = "no info"
export { UniversalCalls, error_no_data, error_no_info }
