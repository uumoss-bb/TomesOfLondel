import {
  buildGetGroup,
  error_no_userId
} from "../getGroup"

test("getGroup - throw error with no userIds", async () => {
  class CoinCalls {}

  const getGroup = buildGetGroup(new CoinCalls()),
  event = {
    pathParameters: { groupId: "groupId" },
    requestContext: {
      authorizer: {
        bobsId: "userID"
      }
    }
  }

  await expect(getGroup(event)).rejects.toThrow(error_no_userId)
})

test("getGroup - throw error when get a coin fails", async () => {
  class CoinCalls {
    async Read() {
      throw new Error("failed to get group")
    }
  }
  
  const getGroup = buildGetGroup(new CoinCalls()),
  event = {
    pathParameters: { groupId: "groupId" },
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }

  await expect(getGroup(event)).rejects.toThrow("failed to get group")
})

test("getGroup - test on success", async () => {
  const coin = {
    PK: "groupId",
    SK: "userId",
  }

  class CoinCalls {
    didDelete = false

    async Read() {
       return coin
    }
  }
  const _CoinCalls = new CoinCalls()

  const getGroup = buildGetGroup(_CoinCalls),
  event = {
    pathParameters: { groupId: "groupId" },
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }, res = await getGroup(event)

  expect(res).toStrictEqual(coin)
})