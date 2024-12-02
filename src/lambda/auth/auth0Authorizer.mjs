import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'
import jwkToPem from 'jwk-to-pem'

const logger = createLogger('auth')

const jwksUrl =
  'https://dev-jinasf087yc373pq.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  if (!jwt) throw new Error('Invalid token')

  const { kid } = jwt.header

  const jwks = await Axios.get(jwksUrl)
  const signingKeys = jwks.data.keys.find((key) => key.kid === kid)

  if (!signingKeys) throw new Error('No key found in JWKS endpoint')

  const pem = jwkToPem(signingKeys)

  try {
    const verifiedToken = jsonwebtoken.verify(token, pem, {
      algorithms: ['RS256']
    })
    return verifiedToken
  } catch (err) {
    throw new Error('Token verification failed')
  }

  // const res = await Axios.get(jwksUrl)
  // const keys = res.data.keys
  // const signingKeys = keys?.find((key) => key.kid === jwt.header.kid)

  // if (!signingKeys) {
  //   throw new Error('No key found in JWKS endpoint')
  // }

  // const pem = signingKeys?.x5c[0]

  // const certificate = `-----BEGIN CERTIFICATE-----\n${pem}\n-----END CERTIFICATE-----`

  // const verifiedToken = verify(token, certificate, { algorithms: ['RS256'] })

  // return verifiedToken
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
