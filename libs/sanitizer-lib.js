export const array_error = "not an array"
export function array(array) {
  if(Array.isArray(array)) {
    return array
  } else {
    throw Error(array_error)
  }
}

export const boolean_error = "not a boolean"
export function boolean(data) {
  if(typeof data === "boolean") {
    return data
  } else {
    throw Error(boolean_error)
  }
}

export const string_error = "not a string"
export function string(string) {

  if(typeof string !== "string"){
    throw Error(string_error)
  }

  string = string.trim()
  return string
}

export const number_error = "not a number"
export function number(data) {
  if(typeof data === "number") {
    return data
  } else {
    throw Error("not a number")
  }
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