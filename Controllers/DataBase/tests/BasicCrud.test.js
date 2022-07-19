import { BasicCrud, error_no_data, error_no_info } from "../BasicCrud"
import UniversalCalls from "../UniversalCalls"


const tableName = "VivedApi-dev-ouzel"

beforeEach(async () => {
  return new Promise(async (resolve) => {
    let CRUD = new UniversalCalls(tableName)
    await CRUD.DeleteAll()
    resolve();
  });
});

test("BasicCrud - test new instant", () => {
  let CRUD = new BasicCrud(tableName)

  expect(CRUD).not.toBeNull()
})

test("BasicCrud - test set tableName", () => {
  let CRUD = new BasicCrud(tableName)
  expect(CRUD.tableName).toBe(tableName)
})

test("BasicCrud - test do I have all the basic crud functions", () => {
  let CRUD = new BasicCrud(tableName)

  expect(CRUD.Create).not.toBeNull()
  expect(CRUD.Read).not.toBeNull()
  expect(CRUD.Update).not.toBeNull()
  expect(CRUD.Delete).not.toBeNull()
})

// -------------- CREATE -----------------------------------------

test("BasicCrud.Create - test return what it was given on success", async () => {
  let CRUD = new BasicCrud(tableName),
  dataToCreate = {
    PK: "123",
    SK: "321"
  },
  res = await CRUD.Create(dataToCreate)

  expect(res).toBe(dataToCreate)
})

test("BasicCrud.Create - test throw error with out PK", async () => {
  let CRUD = new BasicCrud(tableName),
  dataToCreate = {
    // PK: "123",
    SK: "321"
  } 

  await expect(CRUD.Create(dataToCreate)).rejects.toThrow("ValidationException: One or more parameter values were invalid: Missing the key PK in the item")
})

test("BasicCrud.Create - test throw error with out SK", async () => {
  let CRUD = new BasicCrud(tableName),
  dataToCreate = {
    PK: "123",
    // SK: "321"
  } 

  await expect(CRUD.Create(dataToCreate)).rejects.toThrow("ValidationException: One or more parameter values were invalid: Missing the key SK in the item")
})

test("BasicCrud.Create - test throw error with a wrong table name", async () => {
  let CRUD = new BasicCrud("bad_table_name"),
  dataToCreate = {
    PK: "123",
    SK: "321"
  } 

  await expect(CRUD.Create(dataToCreate)).rejects.toThrow("ResourceNotFoundException: Requested resource not found")
})

test("BasicCrud.Create - test throw error with no data", async () => {
  let CRUD = new BasicCrud(tableName)

  await expect(CRUD.Create()).rejects.toThrow(error_no_info)
})

// -------------- READ -----------------------------------------

test("BasicCrud.Read - test throw error with no data", async () => {
  let CRUD = new BasicCrud(tableName)

  await expect(CRUD.Read()).rejects.toThrow(error_no_info)
})

test("BasicCrud.Read - test throw error with a wrong table name", async () => {
  let CRUD = new BasicCrud("bad_table_name")

  await expect(CRUD.Read("PK", "SK")).rejects.toThrow("ResourceNotFoundException: Requested resource not found" )
})

test("BasicCrud.Read - test throw error with no data to get", async () => {
  let CRUD = new BasicCrud(tableName)

  await expect(CRUD.Read("PK", "SK")).rejects.toThrow(error_no_data)
})

test("BasicCrud.Read - test return the right data on success", async () => {
  let CRUD = new BasicCrud(tableName),
  dataToCreate = {
    PK: "123",
    SK: "321"
  },
  data = await CRUD.Create(dataToCreate),
  res = await CRUD.Read(data.PK, data.SK)

  expect(res).toStrictEqual(data)
})

// -------------- UPDATE -----------------------------------------

test("BasicCrud.Update - test throw error with no data", async () => {
  let CRUD = new BasicCrud(tableName)

  await expect(CRUD.Update()).rejects.toThrow(error_no_info)
})

test("BasicCrud.Update - test throw error with no updateParams", async () => {
  let CRUD = new BasicCrud(tableName)

  await expect(CRUD.Update("data")).rejects.toThrow(error_no_info)
})

test("BasicCrud.Update - test throw error with a wrong table name", async () => {
  let CRUD = new BasicCrud("bad_table_name"),
  data = {
    PK: "PK",
    SK: "SK"
  },
  newInformation = {type: "useless"}

  await expect(CRUD.Update(data, newInformation)).rejects.toThrow("ResourceNotFoundException: Requested resource not found" )
})

test("BasicCrud.Update - test throw error with no PK", async () => {
  let CRUD = new BasicCrud(tableName),
  data = {
    // PK: "PK",
    SK: "SK"
  },
  newInformation = {type: "useless"}

  await expect(CRUD.Update(data, newInformation)).rejects.toThrow("ValidationException: Invalid ConditionExpression: An expression attribute value used in expression is not defined; attribute value: :PK")
})

test("BasicCrud.Update - test throw error with no SK", async () => {
  let CRUD = new BasicCrud(tableName),
  data = {
    PK: "PK",
    // SK: "SK"
  },
  newInformation = {type: "useless"}

  await expect(CRUD.Update(data, newInformation)).rejects.toThrow("ValidationException: Invalid ConditionExpression: An expression attribute value used in expression is not defined; attribute value: :SK")
})

test("BasicCrud.Update - test throw error with no new information", async () => {
  let CRUD = new BasicCrud(tableName),
  data = {
    PK: "PK",
    SK: "SK"
  },
  newInformation = {}

  await expect(CRUD.Update(data, newInformation)).rejects.toThrow("ValidationException: ExpressionAttributeNames must not be empty")
})

test("BasicCrud.Update - test return what it was given on success", async () => {
  let CRUD = new BasicCrud(tableName),
  dataToCreate = {
    PK: "123",
    SK: "321",
    data: 0
  },
  data = await CRUD.Create(dataToCreate),
  newInformation = {data: 1},
  res = await CRUD.Update(data, newInformation)

  expect(res.data).toBe(newInformation.data)
})

// -------------- SetUpUpdateParams -----------------------------------------

test("BasicCrud.SetUpUpdateParams - test result with no data", async () => {
  let CRUD = new BasicCrud(tableName),
  data = {},
  updateParams = CRUD.SetUpUpdateParams(data)

  await expect(updateParams).toStrictEqual({ formula: 'SET ', variables: {}, ExpressionAttributeNames: {} })
})

test("BasicCrud.SetUpUpdateParams - test result with good data", async () => {
  let CRUD = new BasicCrud(tableName),
  data = {
    type: "type",
    data: "data"
  },
  updateParams = CRUD.SetUpUpdateParams(data)

  await expect(updateParams).toStrictEqual({ 
    formula: 'SET #type = :type, #data = :data',
    variables: { ':type': 'type', ':data': 'data' },
    ExpressionAttributeNames: { '#type': 'type', '#data': 'data' }
  })
})

// -------------- DELETE -----------------------------------------

test("BasicCrud.Delete - test throw error with no data", async () => {
  let CRUD = new BasicCrud(tableName)

  await expect(CRUD.Delete()).rejects.toThrow(error_no_info)
})

test("BasicCrud.Delete - test throw error with bad table name", async () => {
  let CRUD = new BasicCrud("bad_table_name")

  await expect(CRUD.Delete("PK", "SK")).rejects.toThrow("ResourceNotFoundException: Requested resource not found")
})

test("BasicCrud.Delete - test throw error with no data to delete", async () => {
  let CRUD = new BasicCrud(tableName)

  await expect(CRUD.Delete("PK", "SK")).rejects.toThrow("ConditionalCheckFailedException: The conditional request failed")
})

test("BasicCrud.Delete - test return the data it just deleted on success", async () => {
  let CRUD = new BasicCrud(tableName),
  dataToCreate = {
    PK: "123",
    SK: "321"
  },
  data = await CRUD.Create(dataToCreate),
  res = await CRUD.Delete(data.PK, data.SK)

  expect(res).toStrictEqual(data)
})