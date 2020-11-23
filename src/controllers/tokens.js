import moment from 'moment';
import Firestore from '@google-cloud/firestore';
import { TOKENS_COLLECTION_ID } from '../constants.js';
// https://marketplace.zoom.us/docs/guides/auth/oauth
// create a new client
const firestore = new Firestore();

export async function addAccessToken(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(404).send("Request object missing body")
  }

  const { userId, token } = req.body
  const tokenObj = {
    userId,
    token,
    dateModified: moment.utc().toDate(),
    revoked: false
  }
  // api call to firestore to add token to database
  firestore
    .collection(TOKENS_COLLECTION_ID)
    .doc(userId)
    .set(tokenObj)
    .then(() => {  
      console.log(`Token for user with id ${userId} added`)
      return res.status(200).send(`Token for user with id ${userId} added`)
    })
    .catch(error => {
      console.error(error)
      res.status(404).send('Error adding token to database')
    });
}


export async function getAccessToken(req, res, next) {
  if (!req.body) {
    console.log("Request object missing id query")
    return res.status(404).send("Request object missing id query")
  }

  const userId = req.body.userId || ''

  firestore
    .collection(TOKENS_COLLECTION_ID)
    .doc(userId)
    .get()
    .then(token => {
      token = token.data()
      if (token && !token.revoked) {
        console.log(`Token for user with id ${userId} found\n`, token)
        req.body.token = token
        return next()
      }

      console.log(`Token for user with id ${userId} does not exist`)
      return res.status(404).send(`Token for user with id ${tokenId} does not exist`)
    })
    .catch(error => {
      console.error(error)
      return res.status(404).send("Error fetching token from database")
    })
}


export function checkIfTokenExpired(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(404).send("Request object missing body")
  }

  const { tokenObj } = req.body.token
  req.body.expired = moment.utc().diff(tokenObj.dateModified, 'seconds') > tokenObj.token.expires_in;
  return next();
}

export async function updateAccessToken(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(404).send("Request object missing body")
  }

  if (!req.body.expired) return next();

  const userId = req.body.userId
  // api call to firestore to update token
  firestore
    .collection(TOKENS_COLLECTION_ID)
    .doc(userId)
    .set(req.body.token)
    .then(() => {  
      console.log(`Token for user with id ${userId} updated`)
      return next()
    })
    .catch(error => {
      console.error(error)
      return res.status(404).send('Error updating token')
    });
}


export async function deleteAccessToken(req, res) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(404).send("Request object missing body")
  }

  const userId = req.body.userId

  firestore
    .collection(TOKENS_COLLECTION_ID)
    .doc(userId)
    .update({
      revoked: true
    })
    .then(() => {
      console.log(`token with ${userId} revoked\n`)
      return res.status(200).json({'status': 'success'})
    })
    .catch(error => {
      console.error(error)
      return res.status(404).send("Error deleting token")
    })
}
