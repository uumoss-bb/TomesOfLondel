export default function buildEditCoinGroupRequest(response, editCoinGroup) {
  return async function (event, context) {
    try {
      const coin = await editCoinGroup(event)
      return response.success_200(coin)
    } catch(e) {
      return response.handleErr(e, {event, context}, event.isTesting)
    }
  }
}
