export function success_200(body) {
  body = body || { message: "Success" }; //Default message if body is not passed
  return buildResponse(200, body);
}

export function failure_500(body) {
  body = body || { message: "Internal Service Error" }; //Default message if body is not passed
  return buildResponse(500, body);
}

export function badRequest_400(body) {
  body = body || { message: "Bad Request" }; //Default message if body is not passed
  return buildResponse(400, body);
}

export function unauthorized_401(body) {
  body = body || { message: "Unauthorized" }; //Default message if body is not passed
  return buildResponse(401, body);
}

export function notFound_404(body) {
  body = body || { message: "Not Found" }; //Default message if body is not passed
  return buildResponse(404, body);
}

export function handleErr(err, event, isTesting) {
  if(!isTesting) {
    if(!err?.statusCode) {
      err.statusCode = 500
    }
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    console.log(event)
  }

  if(err.statusCode === 400) {
    return badRequest_400({ message: `${err.message}` })
  }
  if(err.statusCode === 401) {
    return unauthorized_401({ message: `${err.message}` })
  }
  if(err.statusCode === 404) {
    return notFound_404({ message: `${err.message}` })
  }

  return failure_500({ message: `${err.message}` })
}

function setHeaders() {
  const stage = process.env.STAGE

  if(stage === "prod") {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH",
      "Access-Control-Allow-Credentials": false
    }
  }

  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PATCH",
    "Access-Control-Allow-Credentials": true
  }
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: setHeaders(),
    body: JSON.stringify(body)
  };
}
