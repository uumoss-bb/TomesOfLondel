export default function buildCreateCoin(CoinCalls, makeCoin) {
  return async function (event) {
    let body = event?.body,
    userId = event?.requestContext?.authorizer?.userId

    if(!body) {
      throw new Error(error_no_body)
    }
    body = JSON.parse(body)

    if(!userId) {
      throw new Error(error_no_userId)
    }

    let coin = makeCoin({ userId, ...body })
    await CoinCalls.Create(coin)

    return coin
  }
}

const error_no_userId = "no userId",
error_no_body = "no body"

export {
  buildCreateCoin,
  error_no_userId,
  error_no_body
}