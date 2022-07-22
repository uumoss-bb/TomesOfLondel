export default function buildMakeCoin(Id, Sanitizer, date) {
  return function ({ amount, context, group }) {
    let uid = Id(), 
    newCoin = {
      PK: uid,
      SK: uid,
      amount: amount ? Sanitizer.number(amount) : 0,
      context: "STORED",
      date: date.now()
    }

    if(context && ["STORED", "ADDED", "SUBTRACTED"].includes(context)) {
      newCoin.context = Sanitizer.string(context)
    } else if(context) {
      throw Error(invalid_context_error)
    }

    if(group) {
      newCoin.group = Sanitizer.string(group)
    }

    return newCoin
  }
}
const invalid_context_error = "invalid context"

export {
  buildMakeCoin,
  invalid_context_error
}