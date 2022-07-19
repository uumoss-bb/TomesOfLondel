export default function CustomError(message, status) {
  let error = new Error(message)
  error.statusCode = status
  return error
}