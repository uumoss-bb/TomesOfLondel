export function checkIsArray(array) {
  if(Array.isArray(array)) {
    return true
  } else {
    return false
  }
}

export function assetFile_appDataCheck(app_data) {
  let result = true

  if(!Array.isArray(app_data)) {
    result = false
  } else {
    app_data.forEach(data => {
      if(!data.app_id || !string(data.app_id)) {
        result = false
      }
      if(!data.data || !string(data.data)) {
        result = false
      }
    })
  }

  return result
}

export function activitySlidesCheck(slides) {
  let result = true

  function checkAssets(assets) {
    if(!Array.isArray(assets)) {
      result = false
    } else {
      assets.forEach(asset => {
        if(!asset.id || !string(asset.id)) {
          result = false
        }
        if(!asset.version || typeof asset.version !== "number") {
          result = false
        }
      })
    }
  }

  if(!Array.isArray(slides)) {
    result = false
  } else {
    slides.forEach(data => {
      if(!data.id || !string(data.id)) {
        result = false
      }

      if(!data.name || !string(data.name)) {
        result = false
      }

      if(!data.app_id || !string(data.app_id)) {
        result = false
      }

      if(!data.data || !string(data.data)) {
        result = false
      }

      if(!data.assets) {
        result = false
      }

      checkAssets(data.assets)
    })
  }

  return result
}

export function isBoolean(data) {
  if(typeof data === "boolean") {
    return true
  } else {
    return false
  }
}

export function statusCheck(status) {
  const validStatuses = ["draft", "review", "published"]

  if(validStatuses.includes(status)) {
    return true
  } else {
    return false
  }
}

export function assetTypeCheck(asset_type) {
  const validTypes = ["glb", "image"]

  if(validTypes.includes(asset_type)) {
    return true
  } else {
    return false
  }
}

export function accessPatternCheck(status) {
  const validAccessPattern = ["private", "hidden"]

  if(validAccessPattern.includes(status)) {
    return true
  } else {
    return false
  }
}

export function embedPermissionCheck(status) {
  const validAccessPattern = ["anywhere", "disabled", "white_list"]

  if(validAccessPattern.includes(status)) {
    return true
  } else {
    return false
  }
}

//Probably deleting this one
export function channelUsersPermissionsCheck(status) {
  const valid = ["owner", "admin", "author", "member"]

  if(valid.includes(status)) {
    return true
  } else {
    return false
  }
}

export function lodCheck(lod) {
  const validlodes = ["ld", "sd", "hd"]
  
  if(validlodes.includes(lod)) {
    return true
  } else {
    return false
  }
}

export function fileFormatCheck(format) {
  const validlodes = ["glb"]
  
  if(validlodes.includes(format)) {
    return true
  } else {
    return false
  }
}

export const validlanguages = ["ab", "aa", "af", "ak", "sq", "am", "ar", "an", "hy", "as", "av", "ae", "ay", "az", "bm", "ba", "eu", "be", "bn", "bh", "bi", "bs", "br", "bg", "my", "ca", "ch", "ce", "ny", "zh", "cv", "kw", "co", "cr", "hr", "cs", "da", "dv", "nl", "en", "eo", "et", "ee", "fo", "fj", "fi", "fr", "ff", "gl", "ka", "de", "el", "gn", "gu", "ht", "ha", "he", "hz", "hi", "ho", "hu", "ia", "id", "ie", "ga", "ig", "ik", "io", "is", "it", "iu", "ja", "jv", "kl", "kn", "kr", "ks", "kk", "km", "ki", "rw", "ky", "kv", "kg", "ko", "ku", "kj", "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "gv", "mk", "mg", "ms", "mt", "mi", "mr", "mh", "mn", "na", "nv", "nb", "nd", "ne", "ng", "nn", "no", "ii", "nr", "oc", "oj", "cu", "om", "or", "os", "pa", "pi", "fa", "pl", "ps", "pt", "qu", "rm", "rn", "ro", "ru", "sa", "sc", "sd", "se", "sm", "sg", "sr", "gd", "sn", "si", "sk", "sl", "so", "st", "es", "su", "sw", "ss", "sv", "ta", "te", "tg", "th", "ti", "bo", "tk", "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "cy", "wo", "fy", "xh", "yi", "yo", "za"]
export function languageCheck(language) {
  if(validlanguages.includes(language)) {
    return true
  } else {
    return false
  }
}

export function string(string) {

  if(typeof string !== "string"){
    return null
  }

  if(string.replace(/\s/g, "").length === 0) {
    return null
  }

  string = string.trim()
  return string
}

export function isObjectsEquivalent(a, b) {
  // Create arrays of property names
 let aProps = Object.getOwnPropertyNames(a);
 let bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
      return false;
  }

  for (var i = 0; i < aProps.length; i++) {
     let aPropName = aProps[i];
     let bPropName = bProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (aPropName !== bPropName) {
          return false;
      }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}