import {
  buildCreateGroup,
  error_no_userId,
  error_no_body
} from "../createGroup"

test("createGroup - throw error with no body", async () => {
  const createGroup = buildCreateGroup(),
  event = {}

  await expect(createGroup(event)).rejects.toThrow(error_no_body)
})

test("createGroup - throw error with no userId", async () => {
  const createGroup = buildCreateGroup(),
  event = {
    body: JSON.stringify({})
  }

  await expect(createGroup(event)).rejects.toThrow(error_no_userId)
})

test("createGroup - throw error when makeGroup fails", async () => {
  class CoinCalls {}
  const makeGroup = () => {
    throw new Error("failed to make coin")
  }

  const createGroup = buildCreateGroup(new CoinCalls(), makeGroup),
  event = {
    body: JSON.stringify({}),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }

  await expect(createGroup(event)).rejects.toThrow("failed to make coin")
})

test("createGroup - throw error when create a coin fails", async () => {
  class CoinCalls {
    async Create(data) {
      throw new Error("failed to create coin")
    }
  }

  const makeGroup = (data) => {
    return {
      PK: "groupId",
      SK: "groupId",
      type: "coin",
      image: "image"
    }
  }
  
  const createGroup = buildCreateGroup(new CoinCalls(), makeGroup),
  event = {
    body: JSON.stringify({}),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }

  await expect(createGroup(event)).rejects.toThrow("failed to create coin")
})

test("createGroup - test on success", async () => {
  class CoinCalls {
    didDelete = false

    async Create(data) {
       return data
    }
  }
  const _CoinCalls = new CoinCalls()

  const group = {
    PK: "groupId",
    SK: "userId",
  }

  const makeGroup = (data) => {
    return group
  }
  
  const createGroup = buildCreateGroup(_CoinCalls, makeGroup),
  event = {
    body: JSON.stringify({}),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }, res = await createGroup(event)

  expect(res).toStrictEqual(group)
})