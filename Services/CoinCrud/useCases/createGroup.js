export default function buildCreateGroup(CoinCalls, makeGroup) {
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

    let group = makeGroup({ userId, ...body })
    await CoinCalls.Create(group)

    return group
  }
}

const error_no_userId = "no userId",
error_no_body = "no body"

export {
  buildCreateGroup,
  error_no_userId,
  error_no_body
}