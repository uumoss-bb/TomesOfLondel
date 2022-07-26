export default function buildGetGroupRequest(response, getGroup) {
  return async function (event, context) {
    try {
      const group = await getGroup(event)
      return response.success_200(group)
    } catch(e) {
      return response.handleErr(e, {event, context}, event.isTesting)
    }
  }
}
