import Firestore from '@google-cloud/firestore';
import admin from 'firebase-admin';
import { 
  CAREER_FAIR_WEBINARS_COLLECTION_ID,
  ADD_UPDATE_TYPE,
  DELETE_UPDATE_TYPE
} from '../constants.js';

// https://cloud.google.com/firestore
// create a new client
const firestore = new Firestore();

/* 
career fair webinars collection
doc id is the career fair id
data is a list of webinarIds
this data is loaded onto the front end app landing page for career fairs
*/

// creates an entry in the db for every career fair created
// this entry keeps track of all the webinars created for that career fair
export async function dbCreateWebinars(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(404).send("Request object missing body")
  }

  const { careerFairObj } = req.body
  const { college, startDate, endDate } = careerfairObj
  careerFairObj.webinars = []

  let careerFairId = college.concat(startDate, endDate).toString('base64')
  
  firestore
    .collection(CAREER_FAIR_WEBINARS_COLLECTION_ID)
    .doc(careerFairId)
    .set(careerFairObj)
    .then(() => {
      console.log(`Career fair webinars entry with id ${careerFairId} added`)
      return res.status(200).send(`Career fair webinars entry with id ${careerFairId} added`)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error creating career fair webinars entry with id ${careerFairId}`)
    })
}

// get webinars, called by the front end app
export async function dbGetWebinars(req, res, next) {
  if (!req.params) {
    console.log("Request object missing params")
    return res.status(404).send("Request object missing params")
  }

  const careerFairId  = req.params.careerFairId || ''
  
  firestore
    .collection(CAREER_FAIR_WEBINARS_COLLECTION_ID)
    .doc(careerFairId)
    .get()
    .then(careerFairObj => {
      careerFairObj = careerFairObj.data()
      console.log(JSON.stringify(careerFairObj))
      return res.status(200).json(careerFairObj)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting career fair webinars entry with id ${careerFairId}`)
    })
}

// add a webinar to the list of webinars for the career fair or
// delete a webinar from the list of webinars for the career fair
export async function dbUpdateWebinars(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const { careerFairId , webinarId }  = req.params.webinarId
  const { updateType } = req.body
  
  if (updateType === ADD_UPDATE_TYPE && webinarId) {
    firestore
    .collection(CAREER_FAIR_WEBINARS_COLLECTION_ID)
    .doc(careerFairId)
    .update(
      {webinars: admin.firestore.FieldValue.arrayUnion(webinarId)}
    ).then(() => {
      console.log(`Webinar with id ${webinarId} successfully added`)
      return res.status(200).send(`Webinar with id ${webinarId} successfully added`)
    })
    .catch(error => {
      console.error(error)
      res.status(error.response.status || 404).send(`Error adding webinar with id ${webinarId}`)
    })
  } else if (updateType === DELETE_UPDATE_TYPE && webinarId) {
    firestore
    .collection(CAREER_FAIR_WEBINARS_COLLECTION_ID)
    .doc(careerFairId)
    .update(
      {webinars: admin.firestore.FieldValue.arrayRemove(webinarId)}
    ).then(() => {
      console.log(`Webinar with id ${webinarId} successfully deleted from DB`)
      return res.status(200).send(`Webinar with id ${webinarId} successfully deleted from DB`)
    })
    .catch(error => {
      console.error(error)
      res.status(error.response.status || 404).send(`Error deleting webinar with id ${webinarId}`)
    })
  } else {
    console.log('Invalid update type or missing webinar id!')
    return res.status(404).send('Invalid update type or missing webinar id')
  }
}