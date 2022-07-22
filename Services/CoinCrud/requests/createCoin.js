export default function buildCreateCoinRequest(response, createCoin) {
  return async function (event, context) {
    try {
      const newCoin = await createCoin(event)
      return response.success_200(newCoin)
    } catch(e) {
      return response.handleErr(e, {event, context}, event.isTesting)
    }
  }
}

