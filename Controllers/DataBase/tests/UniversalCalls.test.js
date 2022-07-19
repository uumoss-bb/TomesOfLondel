import { UniversalCalls, error_no_data, error_no_info } from "../UniversalCalls"
import { v4 as uuidv4, v4 } from "uuid"
const tableName = "VivedApi-dev-ouzel"

beforeEach(async () => {
  return new Promise(async (resolve) => {
    let CRUD = new UniversalCalls(tableName)
    await CRUD.DeleteAll()
    resolve();
  });
});

beforeAll(function() {
  // let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
})

// -------------- Pagination -----------------------------------------

test("UniversalCalls.Pagination - test throw error with no data", async () => {
  let CRUD = new UniversalCalls(tableName),
  res = await CRUD.Pagination({}, null, null, () => {return {"Count": 0, "Items": [], "ScannedCount": 0}})

  expect(res).toStrictEqual({"ItemsCollected": [], "LastEvaluatedKey": undefined, "newLimit": null})
})

test("UniversalCalls.Pagination - test limit on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    PK: "123",
    type: "123-type"
  },
  query = async (data, offset, limit) => await CRUD.GetData_PKandType(data, offset, limit)

  let amountOfData = 5
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.SK = Math.random().toString()
    await CRUD.Create(dataToCreate)
  }

  let dataToGet = {PK: dataPreSet.PK, type: dataPreSet.type},
  limit = 3,
  res = await CRUD.Pagination(dataToGet, null, limit, query),
  allDataCollected = res.ItemsCollected

  expect(allDataCollected.length).toBe(3)

  while(res.LastEvaluatedKey) {
    let offset = res.LastEvaluatedKey
    res = await CRUD.Pagination(dataToGet, offset, limit, query)
    allDataCollected = [ ...allDataCollected, ...res.ItemsCollected ]
  }

  expect(allDataCollected.length).toBe(amountOfData)
})

test("UniversalCalls.Pagination - test get them all on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    PK: "123",
    type: "123-type"
  },
  query = async (data, offset, limit) => await CRUD.GetData_PKandType(data, offset, limit)

  let amountOfData = 5
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.SK = Math.random().toString()
    await CRUD.Create(dataToCreate)
  }

  let dataToGet = {PK: dataPreSet.PK, type: dataPreSet.type},
  limit = null,
  res = await CRUD.Pagination(dataToGet, null, limit, query),
  allDataCollected = res.ItemsCollected

  expect(allDataCollected.length).toBe(amountOfData)
  expect(res.LastEvaluatedKey).toBeUndefined()
  expect(res.newLimit).toBeNull()
})

// -------------- Get All Data by PK -----------------------------------------

test("UniversalCalls.GetData_PK - test throw error with no data", async () => {
  let CRUD = new UniversalCalls(tableName)

  await expect(CRUD.GetData_PK({})).rejects.toThrow(error_no_info)
})

test("UniversalCalls.GetData_PK - test throw error with bad table name", async () => {
  let CRUD = new UniversalCalls("bad_table_name")

  await expect(CRUD.GetData_PK({PK: "PK"})).rejects.toThrow("ResourceNotFoundException: Requested resource not found")
})

test("UniversalCalls.GetData_PK - test throw error with no data to get", async () => {
  let CRUD = new UniversalCalls(tableName),
  res = await CRUD.GetData_PK({PK: "PK"})

  expect(res).toStrictEqual({"Count": 0, "Items": [], "ScannedCount": 0})
})

test("UniversalCalls.GetData_PK - test on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataToCreate = {
    PK: "123",
    SK: "321",
    type: "123-type"
  },
  data = await CRUD.Create(dataToCreate),
  res = await CRUD.GetData_PK({PK: data.PK})
  expect(res.Items[0]).toStrictEqual(data)
})

test("UniversalCalls.GetData_PK - test limit on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    PK: "123",
    type: "123-type"
  }

  let amountOfData = 5, allDataMade = []
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.SK = Math.random().toString()
    await CRUD.Create(dataToCreate)
    allDataMade.push(dataToCreate)
  }

  let dataToGet = {PK: dataPreSet.PK},
  limit = 3
  let res = await CRUD.GetData_PK(dataToGet, null, limit)

  expect(res.Count).toBe(limit)
})

test("UniversalCalls.GetData_PK - test offset on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    PK: "123",
    type: "123-type"
  }

  let amountOfData = 5, allDataMade = []
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.SK = Math.random().toString()
    await CRUD.Create(dataToCreate)
    allDataMade.push(dataToCreate)
  }

  let dataToGet = {PK: dataPreSet.PK},
  limit = 3,
  _res = await CRUD.GetData_PK(dataToGet, null, limit),
  offset = _res.LastEvaluatedKey,
  res = await CRUD.GetData_PK(dataToGet, offset, limit)

  expect(res.Count).toBe(2)
})

// -------------- Get All Data by PK and Type -----------------------------------------

test("UniversalCalls.GetData_PKandType - test throw error with no data", async () => {
  let CRUD = new UniversalCalls(tableName)

  await expect(CRUD.GetData_PKandType({})).rejects.toThrow(error_no_info)
})

test("UniversalCalls.GetData_PKandType - test throw error with bad table name", async () => {
  let CRUD = new UniversalCalls("bad_table_name")

  await expect(CRUD.GetData_PKandType({PK: "PK", type: "type"})).rejects.toThrow("ResourceNotFoundException: Requested resource not found")
})

test("UniversalCalls.GetData_PKandType - test throw error with no data to get", async () => {
  let CRUD = new UniversalCalls(tableName),
  res = await CRUD.GetData_PKandType({PK: "PK", type: "type"})

  expect(res).toStrictEqual({"Count": 0, "Items": [], "ScannedCount": 0})
})

test("UniversalCalls.GetData_PKandType - test on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataToCreate = {
    PK: "123",
    SK: "321",
    type: "123-type"
  },
  data = await CRUD.Create(dataToCreate),
  res = await CRUD.GetData_PKandType({PK: data.PK, type: data.type})

  expect(res.Items[0]).toStrictEqual(data)
})

test("UniversalCalls.GetData_PKandType - test limit on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    PK: "123",
    type: "123-type"
  }

  let amountOfData = 5, allDataMade = []
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.SK = Math.random().toString()
    await CRUD.Create(dataToCreate)
    allDataMade.push(dataToCreate)
  }

  let dataToGet = {PK: dataPreSet.PK, type: dataPreSet.type},
  limit = 3
  let res = await CRUD.GetData_PKandType(dataToGet, null, limit)

  expect(res.Count).toBe(limit)
})

test("UniversalCalls.GetData_PKandType - test offset on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    PK: "123",
    type: "123-type"
  }

  let amountOfData = 5, allDataMade = []
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.SK = Math.random().toString()
    await CRUD.Create(dataToCreate)
    allDataMade.push(dataToCreate)
  }

  let dataToGet = {PK: dataPreSet.PK, type: dataPreSet.type},
  limit = 3,
  _res = await CRUD.GetData_PKandType(dataToGet, null, limit),
  offset = _res.LastEvaluatedKey,
  res = await CRUD.GetData_PKandType(dataToGet, offset, limit)

  expect(res.Count).toBe(2)
})

// -------------- Get All Data by SK and Type -----------------------------------------

test("UniversalCalls.GetData_SKandType - test throw error with no data", async () => {
  let CRUD = new UniversalCalls(tableName)

  await expect(CRUD.GetData_SKandType({})).rejects.toThrow(error_no_info)
})

test("UniversalCalls.GetData_SKandType - test throw error with bad table name", async () => {
  let CRUD = new UniversalCalls("bad_table_name")

  await expect(CRUD.GetData_SKandType({SK: "PK", type: "type"})).rejects.toThrow("ResourceNotFoundException: Requested resource not found")
})

test("UniversalCalls.GetData_SKandType - test throw error with no data to get", async () => {
  let CRUD = new UniversalCalls(tableName),
  res = await CRUD.GetData_SKandType({SK: "SK", type: "type"})

  expect(res).toStrictEqual({"Count": 0, "Items": [], "ScannedCount": 0})
})

test("UniversalCalls.GetData_SKandType - test on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataToCreate = {
    PK: "123",
    SK: "321",
    type: "123-type"
  },
  data = await CRUD.Create(dataToCreate),
  res = await CRUD.GetData_SKandType({SK: data.SK, type: data.type})

  expect(res.Items[0]).toStrictEqual(data)
})

test("UniversalCalls.GetData_SKandType - test limit on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    SK: "123",
    PK: "123",
    type: "123-type"
  }

  let amountOfData = 5, allDataMade = []
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.PK = Math.random().toString()
    await CRUD.Create(dataToCreate)
    allDataMade.push(dataToCreate)
  }

  let dataToGet = {SK: dataPreSet.SK, type: dataPreSet.type},
  limit = 3
  let res = await CRUD.GetData_SKandType(dataToGet, null, limit)

  expect(res.Count).toBe(limit)
})

test("UniversalCalls.GetData_SKandType - test offset on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    PK: "123",
    SK: "123",
    type: "123-type"
  }

  let amountOfData = 5, allDataMade = []
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.PK = Math.random().toString()
    await CRUD.Create(dataToCreate)
    allDataMade.push(dataToCreate)
  }

  let dataToGet = {SK: dataPreSet.SK, type: dataPreSet.type},
  limit = 3,
  _res = await CRUD.GetData_SKandType(dataToGet, null, limit),
  offset = _res.LastEvaluatedKey,
  res = await CRUD.GetData_SKandType(dataToGet, offset, limit)

  expect(res.Count).toBe(2)
})

// -------------- Get All Data by SK -----------------------------------------

test("UniversalCalls.GetData_SK - test throw error with no data", async () => {
  let CRUD = new UniversalCalls(tableName)

  await expect(CRUD.GetData_SK({})).rejects.toThrow(error_no_info)
})

test("UniversalCalls.GetData_SK - test throw error with bad table name", async () => {
  let CRUD = new UniversalCalls("bad_table_name")

  await expect(CRUD.GetData_SK({SK: "SK"})).rejects.toThrow("ResourceNotFoundException: Requested resource not found")
})

test("UniversalCalls.GetData_SK - test throw error with no data to get", async () => {
  let CRUD = new UniversalCalls(tableName),
  res = await CRUD.GetData_SK({SK: "SK"})

  expect(res).toStrictEqual({"Count": 0, "Items": [], "ScannedCount": 0})
})

test("UniversalCalls.GetData_SK - test on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataToCreate = {
    PK: "123",
    SK: "321",
    type: "123-type"
  },
  data = await CRUD.Create(dataToCreate),
  res = await CRUD.GetData_SK({SK: data.SK})

  expect(res.Items[0]).toStrictEqual(data)
})

test("UniversalCalls.GetData_SK - test limit on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    SK: "123",
    type: "123-type"
  }

  let amountOfData = 5, allDataMade = []
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.PK = Math.random().toString()
    await CRUD.Create(dataToCreate)
    allDataMade.push(dataToCreate)
  }

  let dataToGet = {SK: dataPreSet.SK},
  limit = 3
  let res = await CRUD.GetData_SK(dataToGet, null, limit)

  expect(res.Count).toBe(limit)
})

test("UniversalCalls.GetData_SK - test offset on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    SK: "123",
    type: "123-type"
  }

  let amountOfData = 5, allDataMade = []
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.PK = Math.random().toString()
    await CRUD.Create(dataToCreate)
    allDataMade.push(dataToCreate)
  }

  let dataToGet = {SK: dataPreSet.SK},
  limit = 3,
  _res = await CRUD.GetData_SK(dataToGet, null, limit),
  offset = _res.LastEvaluatedKey,
  res = await CRUD.GetData_SK(dataToGet, offset, limit)

  expect(res.Count).toBe(2)
})

// -------------- Batch Get Items -----------------------------------------

test("UniversalCalls.BatchGetItems - test throw error with no data", async () => {
  let CRUD = new UniversalCalls(tableName)

  await expect(CRUD.BatchGetItems()).rejects.toThrow(error_no_info)
})

test("UniversalCalls.BatchGetItems - test throw error with empty array", async () => {
  let CRUD = new UniversalCalls(tableName)

  await expect(CRUD.BatchGetItems([])).rejects.toThrow(error_no_info)
})

test("UniversalCalls.BatchGetItems - test throw error with bad table name", async () => {
  let CRUD = new UniversalCalls("bad_table_name")

  await expect(CRUD.BatchGetItems([{PK:"PK", SK:"SK"}])).rejects.toThrow("ResourceNotFoundException: Requested resource not found")
})

test("UniversalCalls.BatchGetItems - test throw error with bad data to get", async () => {
  let CRUD = new UniversalCalls(tableName)

  await expect(CRUD.BatchGetItems([{PK:"PK", SK:"SK"}])).rejects.toThrow(error_no_data)
})

test("UniversalCalls.BatchGetItems - test on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataToCreate = {
    PK: "123",
    SK: "321"
  },
  data = await CRUD.Create(dataToCreate),
  res = await CRUD.BatchGetItems([data])

  expect(res.Responses[`${tableName}`][0]).toStrictEqual(data)
})

// -------------- Batch Get All Items -----------------------------------------

test("UniversalCalls.BatchGetAllItems - test on success with 100 + items", async () => {
  let CRUD = new UniversalCalls(tableName),
  allData = []

  for (let index = 0; index < 105; index++) {
    const dataToCreate = {
      PK: v4(),
      SK: index.toString()
    }

    await CRUD.Create(dataToCreate)
    allData.push(dataToCreate)
  }

  let res = await CRUD.BatchGetAllItems([...allData])

  expect(res.length).toBe(allData.length)
})

test("UniversalCalls.BatchGetAllItems - test on success with 10", async () => {
  let CRUD = new UniversalCalls(tableName),
  allData = []

  for (let index = 0; index < 10; index++) {
    const dataToCreate = {
      PK: v4(),
      SK: index.toString()
    }

    await CRUD.Create(dataToCreate)
    allData.push(dataToCreate)
  }

  let res = await CRUD.BatchGetAllItems([...allData])

  expect(res.length).toBe(allData.length)
})


// -------------- Get All Data by type -----------------------------------------

test("UniversalCalls.GetData_Type - test throw error with no data", async () => {
  let CRUD = new UniversalCalls(tableName)

  await expect(CRUD.GetData_Type({})).rejects.toThrow(error_no_info)
})

test("UniversalCalls.GetData_Type - test throw error with no data to get", async () => {
  let CRUD = new UniversalCalls(tableName),
  res = await CRUD.GetData_Type({type: "type"})

  expect(res).toStrictEqual({"Count": 0, "Items": [], "ScannedCount": 0})
})

test("UniversalCalls.GetData_Type - test on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataToCreate = {
    PK: "123",
    SK: "321",
    type: "123-type"
  },
  data = await CRUD.Create(dataToCreate),
  res = await CRUD.GetData_Type({type: data.type})

  expect(res.Items[0]).toStrictEqual(data)
})

test("UniversalCalls.GetData_Type - test limit on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    SK: "123",
    type: "123-type"
  }

  let amountOfData = 5, allDataMade = []
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.PK = Math.random().toString()
    await CRUD.Create(dataToCreate)
    allDataMade.push(dataToCreate)
  }

  let dataToGet = {type: dataPreSet.type},
  limit = 3
  let res = await CRUD.GetData_Type(dataToGet, null, limit)

  expect(res.Count).toBe(limit)
})

test("UniversalCalls.GetData_Type - test offset on success", async () => {
  let CRUD = new UniversalCalls(tableName),
  dataPreSet = {
    SK: "123",
    type: "123-type"
  }

  let amountOfData = 5, allDataMade = []
  for (let index = 0; index < amountOfData; index++) {
    let dataToCreate = dataPreSet
    dataToCreate.PK = Math.random().toString()
    await CRUD.Create(dataToCreate)
    allDataMade.push(dataToCreate)
  }

  let dataToGet = {type: dataPreSet.type},
  limit = 3,
  _res = await CRUD.GetData_Type(dataToGet, null, limit),
  offset = _res.LastEvaluatedKey,
  res = await CRUD.GetData_Type(dataToGet, offset, limit)

  expect(res.Count).toBe(2)
})
