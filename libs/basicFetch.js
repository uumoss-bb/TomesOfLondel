import fetch from "node-fetch"
export default async function basicFetch(url, options) {
  return await fetch(url, options)
    .then(async (response) => {
      return await response.json()
      .then((body) => {

        if(response.status === 200) {
          return body
        }
        else {
          throw new Error("failed - " + url)
        }
      })
    })
    .catch(err => {
      console.error('API ERROR', err)
      throw err
    })
}