export default function buildAcceptChannelInviteRequest(response, acceptChannelInvite) {
  return async function acceptChannelInviteRequest(event, context, callback) {
    try {
      await acceptChannelInvite(event)
      return response.success_200()
    } catch(e) {
      return response.handleErr(e, event, event.isTesting)
    }
  }
}

