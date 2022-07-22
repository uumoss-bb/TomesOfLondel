import {
  buildGetCoin,
  error_no_userId
} from "../getCoin"

test("getCoin - throw error with no userIds", async () => {
  class CoinCalls {}

  const getCoin = buildGetCoin(new CoinCalls()),
  event = {
    pathParameters: { coinId: "coinId" },
    requestContext: {
      authorizer: {
        bobsId: "userID"
      }
    }
  }

  await expect(getCoin(event)).rejects.toThrow(error_no_userId)
})

test("getCoin - throw error when get a coin fails", async () => {
  class CoinCalls {
    async Read() {
      throw new Error("failed to get coin")
    }
  }
  
  const getCoin = buildGetCoin(new CoinCalls()),
  event = {
    pathParameters: { coinId: "coinId" },
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }

  await expect(getCoin(event)).rejects.toThrow("failed to get coin")
})

test("getCoin - test on success", async () => {
  const coin = {
    PK: "coinId",
    SK: "userId",
  }

  class CoinCalls {
    didDelete = false

    async Read() {
       return coin
    }
  }
  const _CoinCalls = new CoinCalls()

  const getCoin = buildGetCoin(_CoinCalls),
  event = {
    pathParameters: { coinId: "coinId" },
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }, res = await getCoin(event)

  expect(res).toStrictEqual(coin)
})