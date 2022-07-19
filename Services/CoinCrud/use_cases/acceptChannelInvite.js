export default function buildAcceptChannelInvite(OuzelCalls) {
  return async function acceptChannelInvite(event) {
    const channelId = event?.pathParameters?.id,
    userId = event?.requestContext?.authorizer?.userId

    if(!channelId) {
      throw new Error(error_no_channelId)
    }

    if(!userId) {
      throw new Error(error_no_userId)
    }

    let user = await OuzelCalls.Read(channelId, userId)

    if(user.role === "owner") {
      const oldOwner = await GetOldChannelOwner(channelId, "channel-user", userId)

      await OuzelCalls.Update(oldOwner, {role: "admin", timestamp: new Date().toUTCString()})

      await OuzelCalls.Update(user, {status: "accepted", timestamp: new Date().toUTCString()})
    } else {

      await OuzelCalls.Update(user, {status: "accepted", timestamp: new Date().toUTCString()})
    }

    return "done"
  }

  async function GetOldChannelOwner(PK, type, newOwnersId) {
    let users = []
    try {
      let res = await OuzelCalls.GetData_PKandType({PK, type})
      users = res.Items
    } catch(e) {
      throw new Error(e)
    }
    const olderOwner = users.filter(user => user.role === "owner" && user.SK !== newOwnersId && user?.status !== "pending")[0]

    return olderOwner
  }
}

const error_no_channelId = "no channelId",
error_no_userId = "userId"
export {
  buildAcceptChannelInvite,
  error_no_channelId,
  error_no_userId
}