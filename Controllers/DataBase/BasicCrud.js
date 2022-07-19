import dynamoDB from "./dynamoDB_helper"
import CustomError from "../../libs/custom-error"

export default class BasicCrud {

  constructor(tableName) {
    this.tableName = tableName
    this.CustomError = CustomError

    this.error_no_data = error_no_data
    this.error_no_info = error_no_info
  }

  async Create(data) {

    if(!data) {
      throw new Error(error_no_info)
    }

    const params = {
      TableName: this.tableName,
      Item: data
    };

    try {
      await dynamoDB("put", params);

      return data
    } catch (e) {

      throw new Error(e)
    }
  }

  async Read(PK, SK) {

    if(!PK || !SK) {
      throw new Error(error_no_info)
    }

    let params = {
      TableName: this.tableName,
      KeyConditionExpression: "PK = :PK and SK = :SK",
      ExpressionAttributeValues: {
        ":PK": PK,
        ":SK": SK
      }
    };
  
    try {
      let resp = await dynamoDB("query", params);
  
      if(resp.Items.length === 0) {
        throw this.CustomError(error_no_data, 404)
      }
      
      let result = resp.Items[0]
      return result
    } catch (e) {
      if(e.message.includes(error_no_data)) {
        throw e
      }
      throw new Error(e)
    }
  }

  async Update(data, newInformation) {

    if(!data || !newInformation) {
      throw new Error(error_no_info) 
    }

    let updateParams = this.SetUpUpdateParams(newInformation),
    params = {
      TableName: this.tableName,
      ConditionExpression: "PK = :PK and SK = :SK",
      ReturnValues: "ALL_NEW",
      Key: {                
        "PK": data.PK,
        "SK": data.SK
      },            
      UpdateExpression: updateParams.formula,
      ExpressionAttributeNames: updateParams.ExpressionAttributeNames,
      ExpressionAttributeValues: {
        ...updateParams.variables,
        ":PK": data.PK,
        ":SK": data.SK
      } 
    }

    try {
      const result = await dynamoDB("update", params);
      return result.Attributes
    } catch (e) {
      throw new Error(e)
    }
  }

  async Delete(PK, SK) {
    
    if(!PK || !SK) {
      throw new Error(error_no_info)
    }

    let params = {
      TableName: this.tableName,
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
        let res = await dynamoDB("delete", params),
        deletedData = res.Attributes
        
        return deletedData
    } catch (e) {
      throw new Error(e)
    }
  }
  
  SetUpUpdateParams(updatedData) {
    let result = {formula: "SET ", variables : {}, ExpressionAttributeNames: {}}
  
    let index = -1
    for (const key in updatedData) {
      index++
      let updatedValue = updatedData[`${key}`]
  
      if(index === 0) {
        result.formula += `#${key} = :${key}`
        result.variables[`:${key}`] = updatedValue
        result.ExpressionAttributeNames[`#${key}`] = key
      } else {//added a comma
        result.formula += `, #${key} = :${key}`
        result.variables[`:${key}`] = updatedValue
        result.ExpressionAttributeNames[`#${key}`] = key
      }
    }
  
    return result
  }
}

const error_no_data = "no data"
const error_no_info = "no info"
export { BasicCrud, error_no_data, error_no_info  }
