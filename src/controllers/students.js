import Firestore from '@google-cloud/firestore';
import admin from 'firebase-admin';
import _ from 'lodash';
import { 
  ADD_UPDATE_TYPE,
  DELETE_UPDATE_TYPE
} from '../constants.js';

// https://cloud.google.com/firestore
// create a new client
const firestore = new Firestore();


/*
  students collection for a particular career fair
  each career fair will have student documents with student email as the id
  data is their schedule
  schedule is two lists
  webinarIds and meetingIds
  both lists are of the form:
   [
    {
      id: 'id'
      topic: 'test',
      start_time: 'time'
      duration: 60
      type: Meeting | Webinar
      join_url: 'http://...'
    },
    ...
  ]
*/

// create a student participant for the career fair
// careerFairId = college.concat(startDate, endDate).toString('base64')
export async function dbCreateStudent(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const { careerFairId, userId } = req.params
  studentObj = {
    schedule: {
      webinars: [],
      meetings: []
    }
  }
  
  firestore
    .collection(careerFairId)
    .doc(userId)
    .set(studentObj)
    .then(() => {
      console.log(`Student with id ${userId} added to career fair with id ${careerfairId}`)
      return res.status(200).send(`Student with id ${userId} added to career fair with id ${careerFairId}`)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error creating student with id ${userId} for career fair with id ${careerfairId}`)
    })
  }

// read the student's schedule
// returns a list of meeting ids and webinar ids
// used by the schedule builder to construct a schedule 
export async function getSchedule(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const { careerFairId, userId } = req.params
  
  firestore
    .collection(careerFairId)
    .doc(userId)
    .get()
    .then(obj=> {
      student = obj.response.data()
      console.log(student.schedule)
      return res.status(200).json(student.schedule)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error fetching schedule for ${userId} in ${careerFairId}`)
    })
  }

// delete a student entry from the career fair
export async function dbDeleteStudent(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const { careerFairId, userId } = req.params
  
  firestore
    .collection(careerFairId)
    .doc(userId)
    .delete()
    .then(() => {
      console.log(`Student with id ${userId} successfully deleted`)
      return res.status(200).send(`Student with id ${userId} successfully deleted`)
    })
    .catch(error => {
      console.error(error)
      res.status(error.response.status || 404).send(`Error deleting student with id ${userId}`)
    })
}
 
// update the student's list of webinars
export async function dbUpdateWebinars(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const { careerFairId, userId, webinarId } = req.params
  const { updateType, webinar } = req.body
  const webinarObj = _.pick(webinar, ['id', 'topic', 'start_time', 'join_url', 'duration' ]) 

  if (updateType === ADD_UPDATE_TYPE) {
    firestore
      .collection(careerFairId)
      .doc(userId)
      .update(
        {'schedule.webinars': admin.firestore.FieldValue.arrayUnion(webinarObj)}
      ).then(() => {
        console.log(`Webinar with id ${webinarId} successfully added`)
        return res.status(200).send(`Webinar with id ${webinarId} successfully added`)
      })
      .catch(error => {
        console.error(error)
        res.status(error.response.status || 404).send(`Error adding webinar with id ${webinarId}`)
      })
  } else if (updateType === DELETE_UPDATE_TYPE) {
    firestore
      .collection(careerFairId)
      .doc(userId)
      .update(
        {'schedule.webinars': admin.firestore.FieldValue.arrayRemove(webinarObj)}
      ).then(() => {
        console.log(`Webinar with id ${webinarId} successfully deleted from DB`)
        return res.status(200).send(`Webinar with id ${webinarId} successfully deleted from DB`)
      })
      .catch(error => {
        console.error(error)
        res.status(error.response.status || 404).send(`Error deleting webinar with id ${webinarId}`)
      })
  } else {
    console.log('Invalid update type!')
  return res.status(404).send('Invalid update type!')
  }
}

// update the student's list of meetings
export async function dbUpdateMeetings(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const { careerFairId, userId } = req.params
  const { updateType, meeting } = req.body
  const meetingObj = _.pick(meeting, ['id', 'topic', 'start_time', 'join_url', 'duration' ])   

  if (updateType === ADD_UPDATE_TYPE) {
    firestore
      .collection(careerFairId)
      .doc(userId)
      .update(
        {'schedule.meetings': admin.firestore.FieldValue.arrayUnion(meetingObj)}
      ).then(() => {
        console.log(`Meeting with id ${meetingId} successfully added to Students DB`)
        return res.status(200).send(`Meeting with id ${meetingId} successfully added to Students DB`)
      })
      .catch(error => {
        console.error(error)
        res.status(error.response.status || 404).send(`Error adding meeting with id ${meetingId}`)
      })
  } else if (updateType === DELETE_UPDATE_TYPE) {
    firestore
      .collection(careerFairId)
      .doc(userId)
      .update(
        {'schedule.meetings': admin.firestore.FieldValue.arrayRemove(meetingObj)}
      ).then(() => {
        console.log(`Meeting with id ${meetingId} successfully deleted from DB`)
        return res.status(200).send(`Meeting with id ${meetingId} successfully deleted from DB`)
      })
      .catch(error => {
        console.error(error)
        res.status(error.response.status || 404).send(`Error deleting meeting with id ${meetingId}`)
      })
  } else {
    console.log('Invalid update type!')
  return res.status(404).send('Invalid update type!')
  }
}
