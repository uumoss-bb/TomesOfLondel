const shell = require("shelljs"),
fs = require("fs-extra"),
chalk = require('chalk')

async function main() {
  let collectionOfEntities = require("./collectionOfEntities.json")

  for (const key in collectionOfEntities) {
    const microService = collectionOfEntities[key];
    console.log("\n", chalk.red(key.toUpperCase()))
    microService.forEach(item => {
      console.log(item)
    })
  }
}

(async ()=>{
  await main();
})(); 