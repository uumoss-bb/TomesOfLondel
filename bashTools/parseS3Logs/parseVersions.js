const s3Logs_JSON = require("./s3logs.json")

async function main() {

  let versionsUsed = []
  s3Logs_JSON.forEach(log => {
    let keyArry = log.key.split("/"),
    version = keyArry[1]

    if(checkVersion(version) && !versionsUsed.includes(version)) {
      versionsUsed.push(version)
    }
  })

  console.clear()
  console.log("\n---------- Player versions in use now. ----------")
  console.log(versionsUsed)
  console.log("\n")
}


function checkVersion(version) {
  // an acceptible version can look like this [1.1.11]
  let versionArr = version.split(""),
  isVersionGood = true,
  isEven = (num) => {
    if(num % 2 == 0) {
      return true
    }
    return false
  },
  expectedLength = 6

  versionArr.forEach((char, i) => {
    let charAsNumber = Number(char)
    charAsNumber = (charAsNumber || charAsNumber === 0)

    if(i > expectedLength) {
      isVersionGood = false
    }

    else if(charAsNumber && i == 0) {
      //then we are good
    }

    else if(char === "." && i == 1) {
      //then we are good
    }

    else if(charAsNumber && i == 2) {
      //1._ we are looking here
      //then we are good
    }

    else if((charAsNumber || char === ".") && i == 3) {
      //1.1_ we are looking here
      //then we are good

      if(char === ".") {
        expectedLength = 5
      }
    }

    else if((charAsNumber || char === ".") && i == 4) {
      //1.11_ we are looking here
      //then we are good
    }

    else if(charAsNumber && i == 4) {
      //1.11._ we are looking here
      //then we are good
    }

    else if(charAsNumber && i == 5) {
      //1.11.1_ we are looking here
      //then we are good
    }

    else if(charAsNumber && i == 6) {
      //1.11.1_ we are looking here
      //then we are good
    }


    else {
      isVersionGood = false
    }
  })

  return isVersionGood
}


(async ()=>{
  await main();
})();

