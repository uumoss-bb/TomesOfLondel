const shell = require("shelljs"),
{ cli } = require("cli-ux"),
chalk = require('chalk'),
inquirer = require("inquirer")

async function main() {
  console.clear()

  let { micro_services, services_fullPath } = await getMicroServices()
  
  let { selected_service, selected_env } = await promptUser(micro_services, services_fullPath)

  await setup(selected_service, selected_env)

  await deploy(selected_service, selected_env)

  await cleanup()
}

async function getMicroServices() {
  let micro_services = [], services_fullPath = []

  let someServices = await shell.exec("ls Services/").stdout.split("\n")
  services_fullPath.push(...someServices.map(service => "Services/" + service))
  micro_services.push(...someServices)
  
  micro_services = micro_services.filter(service => service)

  console.clear()
  return { micro_services, services_fullPath }
}

async function promptUser(micro_services, services_fullPath) {
  let res = await inquirer.prompt([
    {
      type: 'list',
      name: 'selected_service',
      message: 'Choose what service to deploy:',
      choices: micro_services,
    },
    {
      type: 'list',
      name: 'selected_env',
      message: 'Choose the env to deploy in:',
      choices: ["dev", "staging", "prod"],
    }
  ])

  if(res.selected_env === "prod") {
    let confirmRes = await cli.prompt(chalk.yellow("Write CONFIRM to continue with a PRODUCTION deployment"))
    while(confirmRes !== "CONFIRM") {
      console.log(chalk.red("incorrect"))
      confirmRes = await cli.prompt(chalk.yellow("Write CONFIRM to continue with a PRODUCTION deployment"))
    }
  } 

  res.selected_service = services_fullPath.filter(path => path.includes(res.selected_service))[0]

  await clear()
  return res
}

async function setup(selected_service, selected_env) {
  console.log(chalk.green("SETTING UP ENVIROMENT"))
  console.log(chalk.yellow(`Deployment info - ENVIROMENT: ${selected_env} SERVICE: ${selected_service}`))

  await shell.exec("npm install")

  await shell.exec(`cp package.json "${selected_service}"`)
  await shell.cd(selected_service)
  await shell.exec("npm install")

  await clear()
}

async function deploy(selected_service, selected_env) {
  console.log(chalk.green("DEPLOYTING TO AWS"))
  console.log(chalk.yellow(`Deployment info - ENVIROMENT: ${selected_env} SERVICE: ${selected_service}`))
  let deployaRes = await shell.exec(`sls deploy --stage ${selected_env}`)

  let successfullDeployment = !deployaRes.stdout.includes("Serverless Error")
  if(successfullDeployment) {

    await clear()

    console.log(chalk.yellow(`Deployment info - ENVIROMENT: ${selected_env} SERVICE: ${selected_service}`))
    console.log(chalk.green("DEPLOYMENT SUCCESSFUL"))
  } else {
    console.log(chalk.red("\nDEPLOYMENT FAILED"))
  }
}

async function cleanup() {
  await shell.exec("rm *.json")
  await shell.exec("rm -rf node_modules")
  await shell.exec("rm -rf .serverless")
}

async function clear() {
  // await shell.exec("sleep 1")
  // console.clear()
}

(async ()=>{
  await main();
})(); 