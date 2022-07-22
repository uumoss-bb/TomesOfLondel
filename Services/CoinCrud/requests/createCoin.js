export default function buildCreateCoinRequest(response, createCoin) {
  return async function (event, context) {
    try {
      await createCoin(event)
      return response.success_200()
    } catch(e) {
      return response.handleErr(e, {event, context}, event.isTesting)
    }
  }
}

