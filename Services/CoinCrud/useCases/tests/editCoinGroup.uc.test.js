import {
  buildEditCoinGroup,
  error_no_userId,
  error_no_body,
  error_no_group
} from "../editCoinGroup"

test("editCoingGroup - throw error with no body", async () => {
  const editCoingGroup = buildEditCoinGroup(),
  event = {
    pathParameters: { coinId: "coinId" },
  }

  await expect(editCoingGroup(event)).rejects.toThrow(error_no_body)
})

test("editCoingGroup - throw error with no userId", async () => {
  const editCoingGroup = buildEditCoinGroup(),
  event = {
    pathParameters: { coinId: "coinId" },
    body: JSON.stringify({})
  }

  await expect(editCoingGroup(event)).rejects.toThrow(error_no_userId)
})

test("editCoingGroup - throw error when there is no group", async () => {
  class CoinCalls {}

  const editCoingGroup = buildEditCoinGroup(new CoinCalls()),
  event = {
    pathParameters: { coinId: "coinId" },
    body: JSON.stringify({}),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }

  await expect(editCoingGroup(event)).rejects.toThrow(error_no_group)
})

test("editCoingGroup - throw error when update a coin fails", async () => {
  class CoinCalls {

    async Update(data) {
      throw new Error("failed to update coin")
    }

    async Read(data) {
      return data
    }
  }
  
  const editCoingGroup = buildEditCoinGroup(new CoinCalls()),
  event = {
    pathParameters: { coinId: "coinId" },
    body: JSON.stringify({
      group: "newGroup"
    }),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }

  await expect(editCoingGroup(event)).rejects.toThrow("failed to update coin")
})

test("editCoingGroup - test on success", async () => {
  const coin = {
    PK: "coinId",
    SK: "userId",
  }

  class CoinCalls {
    didDelete = false

    async Read(data) {
      return coin
   }

    async Update(data) {
       return coin
    }
  }
  const _CoinCalls = new CoinCalls()
  
  const editCoingGroup = buildEditCoinGroup(_CoinCalls),
  event = {
    pathParameters: { coinId: "coinId" },
    body: JSON.stringify({
      group: "newGroup"
    }),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }, res = await editCoingGroup(event)
  expect(res).toStrictEqual(coin)
})