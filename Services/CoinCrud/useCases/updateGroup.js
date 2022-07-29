export default function buildUpdateGroup(CoinCalls) {
  return async function (event) {
    let body = event?.body,
    groupId = event?.pathParameters.groupId,
    userId = event?.requestContext?.authorizer?.userId

    if(!body) {
      throw new Error(error_no_body)
    }
    body = JSON.parse(body)

    if(!userId) {
      throw new Error(error_no_userId)
    }

    if(!body.name) {
      throw new Error(error_no_name)
    }

    let group = await CoinCalls.Read(groupId, userId)
    return await CoinCalls.Update(group, {name: body.name})
  }
}

const error_no_userId = "no userId",
error_no_body = "no body",
error_no_name = "no name"

export {
  buildUpdateGroup,
  error_no_userId,
  error_no_body,
  error_no_name
}