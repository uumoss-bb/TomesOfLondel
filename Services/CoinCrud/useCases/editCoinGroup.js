export default function buildEditCoinGroup(CoinCalls) {
  return async function (event) {
    let body = event?.body,
    coinId = event?.pathParameters.coinId,
    userId = event?.requestContext?.authorizer?.userId

    if(!body) {
      throw new Error(error_no_body)
    }
    body = JSON.parse(body)

    if(!userId) {
      throw new Error(error_no_userId)
    }

    if(!body.group) {
      throw new Error(error_no_group)
    }

    let coin = await CoinCalls.Read(coinId, userId)
    return await CoinCalls.Update(coin, {group: body.group})
  }
}

const error_no_userId = "no userId",
error_no_body = "no body",
error_no_group = "no group"

export {
  buildEditCoinGroup,
  error_no_userId,
  error_no_body,
  error_no_group
}