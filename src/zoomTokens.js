import axios from 'axios';
import moment from 'moment'
import qs from 'qs';
import { 
  ZOOM_AUTH_HEADER, 
  ZOOM_ACCESS_TOKEN_URL, 
  ZOOM_REDIRECT_URI 
} from './constants.js';
import { ZOOM_REVOKE_ACCESS_URL } from './constants.js';

export async function fetchAccessToken(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(404).send("Request object missing body")
  }

  const { authCode } = req.body

  const options = {
    method: 'POST',
    url: ZOOM_ACCESS_TOKEN_URL,
    headers: { 'Authorization': ZOOM_AUTH_HEADER},
    params: qs.stringify({
      'grant_type': 'authorization_code',
      'code': authCode,
      'redirect_uri': ZOOM_REDIRECT_URI
    })
  }
  
  // api call to zoom to fetch access token
  axios(options)
    .then((token) => {
      req.body.token = JSON.parse(token);
      return next()
    })
    .catch(error => {
      console.error(error)
      return res.status(404).send('Error fetching access token');
    })
}

export async function refreshAccessToken(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(404).send("Request object missing body")
  }

  if (!req.body.expired) return next();

  const options = {
    method: 'POST',
    url: ZOOM_ACCESS_TOKEN_URL,
    headers: { 'Authorization': ZOOM_AUTH_HEADER},
    params: qs.stringify({
      'grant_type': 'refresh_token',
      'refresh_token': req.body.token.refresh_token
    })
  }
  
  // api call to zoom to refresh access token
  axios(options)
    .then((token) => {
      const newToken = {
        userId: req.body.userId,
        tokenObj: JSON.parse(token),
        dateModified: moment.utc().toDate(),
        revoked: false
      }
      req.body.token = newToken
      return next()
    })
    .catch(error => {
      console.error(error)
      return res.status(404).send('Error refreshing access token');
    })
}

export async function revokeAccessToken(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(404).send("Request object missing body")
  }

  const { userId, tokenObj } = req.body.token
  const options = {
    method: 'POST',
    url: ZOOM_REVOKE_ACCESS_URL,
    headers: { 'Authorization': ZOOM_AUTH_HEADER},
    params: qs.stringify({
      'token': tokenObj.access_token
    })
  }
  
  // api call to zoom to refresh access token
  axios(options)
    .then(() => {
      console.log(`Access token for user with id ${userId} revoked`)
      return next()
    })
    .catch(error => {
      console.error(error)
      return res.status(404).send('Error revoking access token');
    })
}