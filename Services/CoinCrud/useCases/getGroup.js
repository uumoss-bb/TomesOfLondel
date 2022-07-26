export default function buildGetGroup(CoinCalls) {
  return async function (event) {
    let groupId = event?.pathParameters.groupId,
    userId = event?.requestContext?.authorizer?.userId

    if(!userId) {
      throw new Error(error_no_userId)
    }

    const coin = await CoinCalls.Read(groupId, userId)

    return coin
  }
}

const error_no_userId = "no userId"

export {
  buildGetGroup,
  error_no_userId
}