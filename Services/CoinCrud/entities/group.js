export default function buildMakeGroup(Id, Sanitizer) {
  return function ({ userId, name }) {

    if(!userId) {
      throw Error(userId_error)
    }

    if(!Sanitizer.string(name)) {
      throw Error(name_error)
    }

    let uid = Id(), 
    newData = {
      PK: uid,
      SK: userId,
      name: Sanitizer.string(name),
    }

    return newData
  }
}
const name_error = "missing name",
userId_error = "missing userId"

export {
  buildMakeGroup,
  name_error,
  userId_error
}