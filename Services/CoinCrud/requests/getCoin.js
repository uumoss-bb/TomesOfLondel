export default function buildGetCoinRequest(response, getCoin) {
  return async function (event, context) {
    try {
      const coin = await getCoin(event)
      return response.success_200(coin)
    } catch(e) {
      return response.handleErr(e, {event, context}, event.isTesting)
    }
  }
}
