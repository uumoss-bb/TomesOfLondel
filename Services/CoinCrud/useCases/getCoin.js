export default function buildGetCoin(CoinCalls) {
  return async function (event) {
    let coinId = event?.pathParameters.coinId,
    userId = event?.requestContext?.authorizer?.userId

    if(!userId) {
      throw new Error(error_no_userId)
    }

    const coin = await CoinCalls.Read(coinId, userId)

    return coin
  }
}

const error_no_userId = "no userId"

export {
  buildGetCoin,
  error_no_userId
}