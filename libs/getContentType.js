import mimeTypes from "mime-types"
import path from "path"
export default function getContentType(filename) {
  let contentType = mimeTypes.contentType(path.extname(filename))

  if(!contentType) {
    console.error("failed to  get mime type for ", filename)
    contentType = "application/octet-stream"
  }

  return contentType
}