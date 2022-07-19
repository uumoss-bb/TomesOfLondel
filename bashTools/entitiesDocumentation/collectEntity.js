import fs from "fs-extra"

export default async function collectEntity(location, entity) {
  try {
    let collectionOfEntities = require("./collectionOfEntities.json"),
    nothingWasReplaced = true

    collectionOfEntities[location] = collectionOfEntities[location].map(oldEntity => {
      if(entity.type === oldEntity.type) {
        nothingWasReplaced = false
        return entity
      } else {
        return oldEntity
      }
    })

    if(nothingWasReplaced) {
      collectionOfEntities[location].push(entity)
    }

    await fs.writeJSON("bashTools/entitiesDocumentation/collectionOfEntities.json", collectionOfEntities, {spaces: "\t"})
  } catch (e) {
    console.error("UNABLE TO DOCUMENT ENTITITES IN --- ", location)
    console.error(e)
  }
}