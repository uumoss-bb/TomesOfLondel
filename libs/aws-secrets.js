import AWS from "aws-sdk" 
export default async function GetSecrects(secret_name) {

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