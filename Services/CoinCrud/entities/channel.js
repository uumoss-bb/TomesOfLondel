export default function buildMakeChannel(CustomError, Id, Sanitizer) {
  return function makeChannel(data) {
    let uid = Id(), 
    newData = {
      PK: uid,
      SK: uid,
      type: "channel",
      join_code: Id().slice(0, 8),
      join_code_status: "enabled",
      access_pattern: "hidden",
      embed_permission: {
        permission: "anywhere",
        domains_allowed: []
      },
      user_limit: 14,
      total_users: 1
    }

    if(data.channel_name) {
      newData.channel_name = Sanitizer.string(data.channel_name)
    }
    
    if(data.image) {
      newData.image = `https://${process.env.S3Bucket}.s3.us-east-1.amazonaws.com/Thumbnails/${data.image}`
    }

    if(data.banner) {
      newData.banner = `https://${process.env.S3Bucket}.s3.us-east-1.amazonaws.com/Thumbnails/${data.banner}`
    }

    if(data.access_pattern) {
      if(!Sanitizer.accessPatternCheck(data.access_pattern)) {
        throw CustomError(error_bad_accessPattern, 400)
      }
      newData.access_pattern = data.access_pattern
    }

    if(data.embed_permission) {
      if(!Sanitizer.embedPermissionCheck(data.embed_permission.permission)) {
        throw CustomError(error_bad_embedPermission, 400)
      }
      newData.embed_permission = data.embed_permission
    }

    if(data.hasOwnProperty("view_collections")) {
      if(typeof data.view_collections !== "boolean") {
        throw CustomError(error_bad_viewCollections, 400)

      }
      newData.view_collections = data.view_collections
    } else {
      newData.view_collections = false
    }

    if(data.user_limit) {
      newData.user_limit = data.user_limit
    }

    return newData
  }
}
const error_bad_accessPattern = "bad accessPattern",
error_bad_embedPermission = "bad embedPermission",
error_bad_viewCollections = "bad viewCollections"

export {
  buildMakeChannel,
  error_bad_accessPattern,
  error_bad_viewCollections,
  error_bad_embedPermission
}