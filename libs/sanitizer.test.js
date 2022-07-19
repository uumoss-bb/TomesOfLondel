import * as Sanitizer from "./sanitizer-lib"

test("Sanitizer.checkIsArray - test on fail", () => {
  let res = Sanitizer.checkIsArray({})
  expect(res).toBe(false)

  res = Sanitizer.checkIsArray("not array")
  expect(res).toBe(false)

  res = Sanitizer.checkIsArray(111)
  expect(res).toBe(false)
})

test("Sanitizer.checkIsArray - test on success", () => {
  let res = Sanitizer.checkIsArray([{id: "id"}])
  expect(res).toBe(true)
})

test("Sanitizer.activitySlidesCheck - test on fail", () => {
  let res = Sanitizer.activitySlidesCheck([{wrong: "data"}])
  expect(res).toBe(false)

  res = Sanitizer.activitySlidesCheck([{id: "   ", name: "name", app_id: "app_id", assets: [{id:"id", version: 1}], data: "data"}])
  expect(res).toBe(false)

  res = Sanitizer.activitySlidesCheck([{id: "id", name: "    ", app_id: "app_id", assets: [{id:"id", version: 1}], data: "data"}])
  expect(res).toBe(false)

  res = Sanitizer.activitySlidesCheck([{id: "id", name: "name", app_id: "    ", assets: [{id:"id", version: 1}], data: "data"}])
  expect(res).toBe(false)

  res = Sanitizer.activitySlidesCheck([{id: "id", name: "name", app_id: "app_id", assets: [{id:"   ", version: 1}], data: "data"}])
  expect(res).toBe(false)

  res = Sanitizer.activitySlidesCheck([{id: "id", name: "name", app_id: "app_id", assets: [{id:"id", version: "1"}], data: "data"}])
  expect(res).toBe(false)

  res = Sanitizer.activitySlidesCheck([{id: "id", name: "name", app_id: "app_id", assets: [{id:"id", version: 1}], data: "  "}])
  expect(res).toBe(false)

  res = Sanitizer.activitySlidesCheck([{id: "id", name: "name", app_id: "app_id", assets: ["wrong"], data: "  "}])
  expect(res).toBe(false)

  res = Sanitizer.activitySlidesCheck("wrong")
  expect(res).toBe(false)
})

test("Sanitizer.activitySlidesCheck - test on success", () => {
  let res = Sanitizer.activitySlidesCheck([{id: "id", name: "name", app_id: "app_id", assets: [{id:"id", version: 1}], data: "data"}])
  expect(res).toBe(true)
})

test("Sanitizer.assetFile_appDataCheck - test on fail", () => {
  let res = Sanitizer.assetFile_appDataCheck([{wrong: "data"}])
  expect(res).toBe(false)

  res = Sanitizer.assetFile_appDataCheck([{app_id: "    ", data: "data"}])
  expect(res).toBe(false)

  res = Sanitizer.assetFile_appDataCheck([{app_id: "app_id", data: "   "}])
  expect(res).toBe(false)

  res = Sanitizer.assetFile_appDataCheck("wrong")
  expect(res).toBe(false)
})

test("Sanitizer.assetFile_appDataCheck - test on success", () => {
  let res = Sanitizer.assetFile_appDataCheck([{app_id: "app_id", data: "data"}, {app_id: "app_id", data: "data"}])
  expect(res).toBe(true)
})

test("Sanitizer.statusCheck - test on fail", () => {
  let res = Sanitizer.statusCheck("wrong")
  expect(res).toBe(false)
})

test("Sanitizer.statusCheck - test on success", () => {
  let res = Sanitizer.statusCheck("draft")
  expect(res).toBe(true)

  res = Sanitizer.statusCheck("review")
  expect(res).toBe(true)

  res = Sanitizer.statusCheck("published")
  expect(res).toBe(true)
})

test("Sanitizer.assetTypeCheck - test on fail", () => {
  let res = Sanitizer.assetTypeCheck("wrong")
  expect(res).toBe(false)
})

test("Sanitizer.assetTypeCheck - test on success", () => {
  let res = Sanitizer.assetTypeCheck("glb")
  expect(res).toBe(true)

  res = Sanitizer.assetTypeCheck("image")
  expect(res).toBe(true)
})

test("Sanitizer.isBoolean - test on fail", () => {
  let res = Sanitizer.isBoolean("wrong")
  expect(res).toBe(false)
})

test("Sanitizer.isBoolean - test on success", () => {
  let res = Sanitizer.isBoolean(true)
  expect(res).toBe(true)

  res = Sanitizer.isBoolean(false)
  expect(res).toBe(true)
})

test("Sanitizer.accessPatternCheck - test on fail", () => {
  let res = Sanitizer.accessPatternCheck("wrong")
  expect(res).toBe(false)
})

test("Sanitizer.accessPatternCheck - test on success", () => {
  let res = Sanitizer.accessPatternCheck("private")
  expect(res).toBe(true)

  res = Sanitizer.accessPatternCheck("hidden")
  expect(res).toBe(true)
})

test("Sanitizer.embedPermissionCheck - test on fail", () => {
  let res = Sanitizer.embedPermissionCheck("wrong")
  expect(res).toBe(false)
})

test("Sanitizer.embedPermissionCheck - test on success", () => {
  let res = Sanitizer.embedPermissionCheck("anywhere")
  expect(res).toBe(true)

  res = Sanitizer.embedPermissionCheck("disabled")
  expect(res).toBe(true)

  res = Sanitizer.embedPermissionCheck("white_list")
  expect(res).toBe(true)
})

test("Sanitizer.lodCheck - test on fail", () => {
  let res = Sanitizer.lodCheck("wrong")
  expect(res).toBe(false)
})

test("Sanitizer.lodCheck - test on success", () => {
  let res = Sanitizer.lodCheck("ld")
  expect(res).toBe(true)

  res = Sanitizer.lodCheck("sd")
  expect(res).toBe(true)

  res = Sanitizer.lodCheck("hd")
  expect(res).toBe(true)
})

test("Sanitizer.fileFormatCheck - test on fail", () => {
  let res = Sanitizer.fileFormatCheck("wrong")
  expect(res).toBe(false)
})

test("Sanitizer.fileFormatCheck - test on success", () => {
  let res = Sanitizer.fileFormatCheck("glb")
  expect(res).toBe(true)
})

test("Sanitizer.languageCheck - test on fail", () => {
  let res = Sanitizer.languageCheck("wrong")
  expect(res).toBe(false)
})

test("Sanitizer.languageCheck - test on success", () => {
  Sanitizer.validlanguages.forEach(lan => {
    let res = Sanitizer.languageCheck(lan)
    expect(res).toBe(true)
  })
})

test("Sanitizer.string - test with nothing in string", () => {
  let res = Sanitizer.string("       ")
  expect(res).toBe(null)
})

test("Sanitizer.string - test with alot to trim", () => {
  let res = Sanitizer.string("    hi   ")
  expect(res).toBe("hi")
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