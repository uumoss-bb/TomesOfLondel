const shell = require("shelljs"),
{ cli } = require("cli-ux"),
inquirer = require("inquirer"),
uuid = require("uuid"),
AWS = require('aws-sdk'),
chalk = require('chalk'),
CryptoJS = require("crypto-js")

async function main() {
  console.clear()
  
  let { selected_env, owner, channels } = await promptUser()

  const { ouzelTable, accessTable } = getTableName(selected_env)

  const accessKey = makeLTIAccessKey({
    owner
  })

  let secret = accessKey.secret

  const superSecret = await GetSecrects("LMS_SECRET")

  accessKey.secret = encrypt(accessKey.secret, superSecret)

  const channelUsers = []
  channels.forEach(channelId => {
    const channelUser = makeChannelUser({
      channelId,
      userId: accessKey.access_id,
      role: "member"
    })

    channelUsers.push(channelUser)
  })

  await Create(accessKey, accessTable)
  console.log("created access key")

  for (let index = 0; index < channelUsers.length; index++) {
    const data = channelUsers[index];
    await Create(data, ouzelTable)
    console.log("created channel user")
  }

  await clear()
  console.log(chalk.cyan("Owner: "), accessKey.owner)
  console.log(chalk.cyan("Id: "), accessKey.access_id)
  console.log(chalk.cyan("Secret: "), secret)
  console.log(chalk.cyan("Channel Count: "), channelUsers.length)

  console.log("\n",chalk.green("DONE"))
}

async function promptUser() {
  let res = await inquirer.prompt([
    {
      type: 'list',
      name: 'env',
      message: 'Choose what env to work in:',
      choices: ["prod", "staging", "dev"],
    }
  ])
  const selected_env = res.env

  if(selected_env === "prod") {
    let confirmRes = await cli.prompt(chalk.yellow("Write CONFIRM to continue with a PRODUCTION deployment"))
    while(confirmRes !== "CONFIRM") {
      console.log(chalk.red("incorrect"))
      confirmRes = await cli.prompt(chalk.yellow("Write CONFIRM to continue with a PRODUCTION deployment"))
    }
  } 

  const owner = await cli.prompt("Name the owner")

  let gettingChannels = true, channels = []
  while(gettingChannels) {
    const channel = await cli.prompt("Enter a channel id to link to (enter done when finsihed)", {default: "done"})
    if(channel === "done") {
      gettingChannels = false
    } else {
      channels.push(channel)
    }
  }

  await clear()
  return { selected_env, owner, channels }
}

async function clear() {
  await shell.exec("sleep 1")
  console.clear()
}

function makeChannelUser(data) {
  
  let result = {
    PK: data.channelId,
    SK: data.userId,
    role: data.role,
    timestamp: new Date().toUTCString()
  }
  
  return result
}

function makeLTIAccessKey(data) {

  let newData = {
    access_id: uuid.v4(),
    secret: uuid.v4(),
    owner: data.owner,
    type: "lti-accessKey"
  }

  return newData
}

async function GetSecrects(secret_name) {

  const GetSecrect = (secret_name) => {
    return new Promise((resolve, reject) => {
  
        const client = new AWS.SecretsManager({region: "us-east-1"});
        client.getSecretValue({SecretId: secret_name}, 
            function(err, data) {
                if (err) {
                    reject(err)
                }
                else {
                    if ('SecretString' in data) {
                        resolve(data.SecretString)
                    } else {
                        let buff = new Buffer.from(data.SecretBinary, 'base64');
                        resolve(buff.toString('ascii'))
                    }
                }
            }
        )
    })
  }

  return await GetSecrect(secret_name)
  .then(secrect => {
      secrect = JSON.parse(secrect)
      return Object.values(secrect)[0]
  })
  .catch(err => {
      console.error(err)
      throw new Error(err)
  })
}

async function Create(data, tableName) {

  const params = {
    TableName: tableName,
    Item: data
  };

  try {
    await dynamoDB("put", params);
    return data
  } catch (e) {
    throw new Error(e)
  }
}

function dynamoDB(action, params)
{   
    AWS.config.update({region: 'us-east-1'});
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    return dynamoDb[action](params).promise();
}

function getTableName(env) {

  return {
    ouzelTable: `VivedApi-${env}-ouzel`,
    accessTable: `VivedApi-${env}-playeraccess`
  }
}

function encrypt(data, secret) {
  return CryptoJS.AES.encrypt(data, secret).toString()
}

(async ()=>{
  await main();
})(); 