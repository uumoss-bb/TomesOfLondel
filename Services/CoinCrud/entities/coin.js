export default function buildMakeCoin(Id, Sanitizer, date) {
  return function ({ userId, amount, context, group }) {

    if(!userId) {
      throw Error(userId_error)
    }

    let uid = Id(), 
    newCoin = {
      PK: uid,
      SK: userId,
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
const invalid_context_error = "invalid context",
userId_error = "missing userId"

export {
  buildMakeCoin,
  invalid_context_error,
  userId_error
}