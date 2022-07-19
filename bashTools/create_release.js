const shell = require("shelljs"),
{ cli } = require("cli-ux"),
chalk = require('chalk'),
fs = require("fs-extra")

async function main() {

  checkWeAreInDevelop()

  const newVersion = await getAndSetVersion()

  await makeNewBranch(newVersion)

  await createPipeline(newVersion)

  shell.echo(chalk.green("DONE"))
}

async function makeNewBranch(newVersion) {

  
  await shell.exec("git add .")
  await shell.exec(`git commit -m "updating version: ${newVersion}"`)
  await shell.exec("git push")

  await shell.exec(`git checkout -b release_${newVersion}`)

  await shell.exec("git add .")
  await shell.exec(`git commit -m "first push"`)
  await shell.exec(`git push --set-upstream origin release_${newVersion}`)

}

async function createPipeline(newVersion) {
  console.log(chalk.yellow("\nCreating new pipeline"))

  let pipelineRes = await shell.exec(`aws cloudformation deploy --stack-name "vived-api-release-pipeline" --template-file bashTools/ReleaseTemplatePipeline.yaml \
  --parameter-overrides BranchName=release_${newVersion} \
  --region us-east-1 --capabilities CAPABILITY_NAMED_IAM`)

  if(pipelineRes.stderr) {
    throw new Error(chalk.red("Failed to create new pipeline."))
  }
}

function checkWeAreInDevelop() {
  let currentBranch = shell.exec("git branch --show-current").stdout.replace("\n", "")
  if(currentBranch != "develop" && !currentBranch.includes("release")) {
    console.log(chalk.red("This command can only be run from develop or release branch"))
    throw new Error()
  }
  console.clear()
}

async function getAndSetVersion() {
  let package = require("../package.json")
  
  shell.echo(chalk.yellow("Old version: " + package.version))

  let newVersion = await cli.prompt("Please enter a new version")

  checkIsVersion(newVersion)

  checkIsVersionHigher(package.version, newVersion)
  
  package.version = newVersion
  
  await fs.writeJSON("./package.json", package, {spaces: "\t"})

  return newVersion
}

function checkIsVersionHigher(oldVer, newVer) {
  oldVer = Number(oldVer.split(".").join(""))
  newVer  = Number(newVer.split(".").join(""))

  if(oldVer >= newVer) {
    throw new Error(chalk.red("version must be higher"))
  }
}

function checkIsVersion(version) {
  // an acceptible version can look like this [1.1.11]
  let versionArr = version.split(""),
  isVersionGood = true,
  isEven = (num) => {
    if(num % 2 == 0) {
      return true
    }
    return false
  }

  versionArr.forEach((char, i) => {
    let charAsNumber = Number(char)

    if(i > 5) {
      isVersionGood = false
    }

    else if((charAsNumber || charAsNumber === 0) && isEven(i)) {
      //then we are good
    } 

    else if(char === "." && !isEven(i)) {
      //then we are good
    }

    else if(charAsNumber && i == 5) {
      //then we are good
    }

    else {
      isVersionGood = false
    }
  })

  if(!isVersionGood) {
    throw new Error(chalk.red("version must be in this format: 1.1.11"))
  }
}

(async ()=>{
  await main();
})();

