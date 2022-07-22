import {
  buildCreateCoin,
  error_no_userId,
  error_no_body
} from "../createCoin"

test("createCoin - throw error with no body", async () => {
  const createCoin = buildCreateCoin(),
  event = {}

  await expect(createCoin(event)).rejects.toThrow(error_no_body)
})

test("createCoin - throw error with no userId", async () => {
  const createCoin = buildCreateCoin(),
  event = {
    body: JSON.stringify({})
  }

  await expect(createCoin(event)).rejects.toThrow(error_no_userId)
})

test("createCoin - throw error when makeCoin fails", async () => {
  class CoinCalls {}
  const makeCoin = () => {
    throw new Error("failed to make coin")
  }

  const createCoin = buildCreateCoin(new CoinCalls(), makeCoin),
  event = {
    body: JSON.stringify({}),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }

  await expect(createCoin(event)).rejects.toThrow("failed to make coin")
})

test("createCoin - throw error when create a coin fails", async () => {
  class CoinCalls {
    async Create(data) {
      throw new Error("failed to create coin")
    }
  }

  const makeCoin = (data) => {
    return {
      PK: "coinId",
      SK: "coinId",
      type: "coin",
      image: "image"
    }
  }
  
  const createCoin = buildCreateCoin(new CoinCalls(), makeCoin),
  event = {
    body: JSON.stringify({}),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }

  await expect(createCoin(event)).rejects.toThrow("failed to create coin")
})

test("createCoin - test on success", async () => {
  class CoinCalls {
    didDelete = false

    async Create(data) {
       return data
    }
  }
  const _CoinCalls = new CoinCalls()

  const coin = {
    PK: "coinId",
    SK: "userId",
  }

  const makeCoin = (data) => {
    return coin
  }
  
  const createCoin = buildCreateCoin(_CoinCalls, makeCoin),
  event = {
    body: JSON.stringify({}),
    requestContext: {
      authorizer: {
        userId: "userID"
      }
    }
  }, res = await createCoin(event)

  expect(res).toStrictEqual(coin)
})