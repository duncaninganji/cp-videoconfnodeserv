// WIP
import moment from 'moment';
import Firestore from '@google-cloud/firestore';
import admin from 'firebase-admin';
import { 
  ADD_UPDATE_TYPE,
  DELETE_UPDATE_TYPE
} from '../constants.js';

// https://cloud.google.com/firestore
// create a new client
const firestore = new Firestore();


/* 
  career fair recruiters collection
  recruiter zoom email is the id
  data is their schedule, preferred time slot length and an option to enforce sequential bookings
  as well as an availability object
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
  availability object is of the form
  {
    DateStr: [[start, end]] ** always sorted default value [9a, 5p] for all dates
  }
*/

// create a recruiter participant for the career fair
// careerFairId = college.concat(startDate, endDate).toString('base64')
export async function dbCreateRecruiter(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const { careerFairId, userId } = req.params
  const { slotLength, isSequential, availabilityObj } = req.body
  recruiterObj = {
    schedule : {
      webinars: [],
      meetings: [],
    },
    slotLength,
    isSequential,
    availabilityObj
  }
  
  firestore
    .collection(careerFairId)
    .doc(userId)
    .set(recruiterObj)
    .then(() => {
      console.log(`Recruiter with id ${userId} added to career fair with id ${careerfairId}`)
      return res.status(200).send(`Recruiter with id ${userId} added to career fair with id ${careerFairId}`)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error creating recruiter with id ${userId} for career fair with id ${careerfairId}`)
    })
  }


// get the recruiter object
export async function getRecruiter(req, res, next) {
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
      recruiter= obj.response.data()
      req.body.recruiterObj = recruiter
      return next()
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error fetching recruiter ${userId} in ${careerFairId}`)
    })
  }


// read the recruiter's schedule
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
      recruiter= obj.response.data()
      console.log(recruiter.schedule)
      return res.status(200).json(recruiter.schedule)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error fetching schedule for ${userId} in ${careerFairId}`)
    })
  }

// delete a recruiter entry from the career fair
export async function dbDeleteRecruiter(req, res, next) {
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
      console.log(`Recruiter with id ${userId} successfully deleted from ${careerFairId}`)
      return res.status(200).send(`Recruiter with id ${userId} successfully deleted from ${careerFairId}`)
    })
    .catch(error => {
      console.error(error)
      res.status(error.response.status || 404).send(`Error deleting recruiter with id ${userId} from ${careerFairId}`)
    })
}

// update a recruiters meetings schedule
// fetches the existing availability object and returns an updated one with the
// meeting added or removed from the schedule
export async function dbUpdateMeetings(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const { careerFairId, userId } = req.params
  const { updateType, meeting, recruiterObj } = req.body
  const { id, duration, start_time } = meeting
  const meetingObj = _.pick(meeting, ['id', 'topic', 'start_time', 'start_url', 'duration'])

  newAvailabilityObj = updateAvailabilities(
    recruiterObj.availabilityObj,
    start_time,
    duration,
    updateType
  )

  if (updateType === ADD_UPDATE_TYPE) {
    firestore
      .collection(careerFairId)
      .doc(userId)
      .update(
        { 
          availabilityObj: newAvailabilityObj,
          'schedule.meetings': admin.firestore.FieldValue.arrayUnion(meetingObj)
        }
      ).then(() => {
        console.log(`Meeting with id ${id} successfully added to Recruiters DB`)
        return next()
      })
      .catch(error => {
        console.error(error)
        res.status(error.response.status || 404).send(`Error adding meeting with id ${id}`)
      })
  } else if (updateType === DELETE_UPDATE_TYPE) {
    firestore
      .collection(careerFairId)
      .doc(userId)
      .update(
        { 
          availabilityObj: newAvailabilityObj,
          'schedule.meetings': admin.firestore.FieldValue.arrayRemove(meetingObj)
        }
      ).then(() => {
        console.log(`Meeting with id ${id} successfully deleted from DB`)
        return res.status(200).send(`Meeting with id ${id} successfully deleted from DB`)
      })
      .catch(error => {
        console.error(error)
        res.status(error.response.status || 404).send(`Error deleting meeting with id ${id}`)
      })
  } else {
    console.log('Invalid update type!')
  return res.status(404).send('Invalid update type!')
  }
}
/*
  availability object is of the form
  {
    DateStr: [[start, end]] ** always sorted default value [9a, 5p] for all dates
  }
  helper method to update availabilities
  extract date and time separately from start time
  end time = duration + start time
  loop through availability for that date
  updateType === ADD_UPDATE_TYPE
    adding a meeting splits existing availabilities or deletes availabilities entirely
    iff start == s1 and end == e1 then [s1, e1] is deleted
    iff start >= s1 and end <= e1 then split [s1, e1] to [s1, start] and [end, e1]
  updateType === DELETE_UPDATE_TYPE
  deleting a meeting merges existing availabilities or creates new availabilities
    iff start == e1 and end == s2 then [s1, e1], [s2, e2] becomes [s1, e2]
    iff start > e1 and end < s2 then [s1, e1], [s2, e2] becomes [s1, e1], [start, end], [s2, e2]
  return updated availabilities object
*/
const updateAvailabilities = (availabilityObj, start_time, duration) => {
  // extract date and time separately from start time
  // end time = duration + start time
  start_time = moment(start_time)
  end_time = start_time.add(duration, 'minutes')
  const newAvailability = []

  for (const dateStr in availabilityObj) {
    if (moment(dateStr).isSameDay(start_time)) {
      let availability = availabilityObj[dateStr]
      // adding a meeting splits existing availabilities
      if (updateType === ADD_UPDATE_TYPE) {
        for (const time_slot in availability) {
          s = time_slot[0]
          e = time_slot[1]
          if (start_time.isSame(s) && end_time.isSame(e)) {
            // iff start == s and end == e then skip this time_slot
            continue;
          } else if (start_time.isAfter(s) && end_time.isBefore(e)) {
            // iff start > s and end < e then split [s, e] to [s, start] and [end, e]
            newAvailability.push([s, start_time])
            newAvailability.push([end_time, e])
          } else {
            // else maintain original time slot for that position
            newAvailability.push(time_slot)
          }
        }
      } else if (updateType === DELETE_UPDATE_TYPE) {
        // deleting a meeting merge existing availabilities
        for (i = 0; i < availability.length; ++i) {
          s1 = availability[i][0]
          e1 = availability[i][1]
          
          if (i < availability.length - 1) {
            // need to look at slots two at a time for possible merges
            s2 = availability[i+1][0]
            e2 = availability[i+1][1]

            if (start_time.isSame(e1) && end_time.isSame(s2)) {
              // iff start == e1 and end == s2 then [s1, e1], [s2, e2] becomes [s1, e2]
              newAvailability.push([s1, e2])
              i += 1
            } else if (start_time.isAfter(e1) && end_time.isBefore(s2)) {
              // iff start > e1 and end < s2 then [s1, e1], [s2, e2] becomes [s1, e1], [start, end], [s2, e2]
              newAvailability.push([s1, e1])
              newAvailability.push([start_time, end_time])
            } else {
              // else maintain original time slot for that position
              newAvailability.push([s1, e1])
            }
          }
        } 
      }
      availabilityObj[dateStr] = newAvailability
      break;
    }
  }
  return availabilityObj
}

// update the recruiter's list of webinars
export async function dbUpdateWebinars(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const { careerFairId, userId } = req.params
  const { updateType, webinar, recruiterObj } = req.body
  const { id, duration, start_time } = webinar
  const webinarObj = _.pick(webinar, ['id', 'topic', 'start_time', 'start_url', 'duration'])

  newAvailabilityObj = updateAvailabilities(
    recruiterObj.availabilityObj,
    start_time,
    duration,
    updateType
  )

  if (updateType === ADD_UPDATE_TYPE) {
    firestore
      .collection(careerFairId)
      .doc(userId)
      .update(
        { 
          availabilityObj: newAvailabilityObj,
          'schedule.webinars': admin.firestore.FieldValue.arrayUnion(webinarObj)
        }
      ).then(() => {
        console.log(`Webinar with id ${id} successfully added to Recruiters DB`)
        return next()
      })
      .catch(error => {
        console.error(error)
        res.status(error.response.status || 404).send(`Error adding webinar with id ${id}`)
      })
  } else if (updateType === DELETE_UPDATE_TYPE) {
    firestore
      .collection(careerFairId)
      .doc(userId)
      .update(
        { 
          availabilityObj: newAvailabilityObj,
          'schedule.webinar': admin.firestore.FieldValue.arrayRemove(webinarObj)
        }
      ).then(() => {
        console.log(`Webinar with id ${id} successfully deleted from DB`)
        return res.status(200).send(`Meeting with id ${id} successfully deleted from DB`)
      })
      .catch(error => {
        console.error(error)
        res.status(error.response.status || 404).send(`Error deleting webinar with id ${id}`)
      })
  } else {
    console.log('Invalid update type!')
  return res.status(404).send('Invalid update type!')
  }
}

// get all meetings
// get all webinars
// get schedule
// returns [
//   {
//      topic: 'test',
//      start_time: 'time'
//      duration: 60
//      type: Meeting | Webinar
//      join_url: 'http://...'
//   }
// ]


// booking a 1-1
// get the recruiter's document
// return unavailabilites object
// display availabilites on the front end
// user selects slots
// return selected slots to book route
// add selected slots to unavailablities list
// update student and recruiter schedules
// create meeting if necessary
// ping recruiter and student via email with all the relevant info 

// recruiter creates a webinar
// zoom API call made
// added to list of webinars for that career fair
// front end app will update on reload
// added on recruiter's schedule as well as fellow invited recruiters
// ping all recruiters involved via email


// schedule builder in separate file
// takes in student/recruiter id and career fair id
// gets list of webinarIds and meetingIds
// makes API calls to Zoom to get back meeting and webinar data
// returns a list of objects sorted by time
// {
//  Name: ...,
//  Date: ...,
//  Start Time: ...,
//  End Time: ...
// }

// const admin =  requi

