import jwt from "jsonwebtoken"

function sign(payload, secret) {
  return jwt.sign(payload, secret)
}

function decode(token) {
  return jwt.decode(token)
}

function verify(token, secret, callback) {
  return jwt.verify(token, secret, callback)
}

export default {
  sign,
  decode,
  verify
}