export default function buildUpadteGroupRequest(response, updateGroup) {
  return async function (event, context) {
    try {
      const group = await updateGroup(event)
      return response.success_200(group)
    } catch(e) {
      return response.handleErr(e, {event, context}, event.isTesting)
    }
  }
}
