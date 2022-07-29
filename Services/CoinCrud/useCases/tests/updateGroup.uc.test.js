import {
  buildUpdateGroup,
  error_no_userId,
  error_no_body,
  error_no_name
} from "../updateGroup"

test("updateGroup - throw error with no body", async () => {
  const updateGroup = buildUpdateGroup(),
  event = {
    pathParameters: { coinId: "coinId" },
  }

  await expect(updateGroup(event)).rejects.toThrow(error_no_body)
})

test("updateGroup - throw error with no userId", async () => {
  const updateGroup = buildUpdateGroup(),
  event = {
    pathParameters: { coinId: "coinId" },
    body: JSON.stringify({})
  }

  await expect(updateGroup(event)).rejects.toThrow(error_no_userId)
})

test("updateGroup - throw error when there is no name", async () => {
  class CoinCalls {}

  const updateGroup = buildUpdateGroup(new CoinCalls()),
  event = {
    pathParameters: { coinId: "coinId" },
    body: JSON.stringify({}),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }

  await expect(updateGroup(event)).rejects.toThrow(error_no_name)
})

test("updateGroup - throw error when update a coin fails", async () => {
  class CoinCalls {

    async Update(data) {
      throw new Error("failed to update coin")
    }

    async Read(data) {
      return data
    }
  }
  
  const updateGroup = buildUpdateGroup(new CoinCalls()),
  event = {
    pathParameters: { coinId: "coinId" },
    body: JSON.stringify({
      name: "newGroup"
    }),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }

  await expect(updateGroup(event)).rejects.toThrow("failed to update coin")
})

test("updateGroup - test on success", async () => {
  const group = {
    PK: "groupId",
    SK: "userId",
  }

  class CoinCalls {
    didDelete = false

    async Read(data) {
      return group
   }

    async Update(data) {
       return group
    }
  }
  const _CoinCalls = new CoinCalls()
  
  const updateGroup = buildUpdateGroup(_CoinCalls),
  event = {
    pathParameters: { groupId: "groupId" },
    body: JSON.stringify({
      name: "newGroup"
    }),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }, res = await updateGroup(event)
  expect(res).toStrictEqual(group)
})