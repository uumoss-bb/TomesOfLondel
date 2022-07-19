import CryptoJS from "crypto-js"

export function encrypt(data, secret) {
  return CryptoJS.AES.encrypt(data, secret).toString()
}

export function decrypt(data, secret) {
  let result = CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8)

  if(!result) {
    throw new Error("failed to decrypt")
  }

  return result
}