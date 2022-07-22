import * as Sanitizer from "./sanitizer-lib"

test("Sanitizer.array - test on fail", () => {
  expect(() => Sanitizer.array({})).toThrowError(Sanitizer.array_error)

  expect(() => Sanitizer.array({})).toThrowError(Sanitizer.array_error)

  expect(() => Sanitizer.array(111)).toThrowError(Sanitizer.array_error)
})

test("Sanitizer.array - test on success", () => {
  let arr = [{id: "id"}]
  expect(Sanitizer.array(arr)).toBe(arr)
})

test("Sanitizer.boolean - test on fail", () => {
  expect(() => Sanitizer.boolean("wrong")).toThrowError(Sanitizer.boolean_error)
  expect(() => Sanitizer.boolean(3)).toThrowError(Sanitizer.boolean_error)
})

test("Sanitizer.boolean - test on success", () => {
  expect(Sanitizer.boolean(true)).toBe(true)
  expect(Sanitizer.boolean(false)).toBe(false)
})

test("Sanitizer.string - test error", () => {
  expect(() => Sanitizer.string(123)).toThrowError(Sanitizer.string_error)
})

test("Sanitizer.string - test with alot to trim", () => {
  expect(Sanitizer.string("    hi   ")).toBe("hi")
  expect(Sanitizer.string("       ")).toBe("")
})

test("Sanitizer.isObjectsEquivalent - test on fail", () => {
  let objectA = {
    hi:"hi"
  }, objectB = {
    bye:"bye"
  },
  res = Sanitizer.isObjectsEquivalent(objectA, objectB)
  expect(res).toBe(false)
})

test("Sanitizer.isObjectsEquivalent - test on success", () => {
  let objectA = {
    hi:"hi"
  }, objectB = {
    hi:"hiASDF"
  },
  res = Sanitizer.isObjectsEquivalent(objectA, objectB)
  expect(res).toBe(true)
})