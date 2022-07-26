export default function buildCreateGroupRequest(response, createGroup) {
  return async function (event, context) {
    try {
      const newGroup = await createGroup(event)
      return response.success_200(newGroup)
    } catch(e) {
      return response.handleErr(e, {event, context}, event.isTesting)
    }
  }
}

