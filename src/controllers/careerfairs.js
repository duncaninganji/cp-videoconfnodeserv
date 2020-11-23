import moment from 'moment';
import Firestore from '@google-cloud/firestore';
import admin from 'firebase-admin';
import { 
  CAREER_FAIR_STUDENTS_COLLECTION_ID, 
  CAREER_FAIR_WEBINARS_COLLECTION_ID, 
  CAREER_FAIR_RECRUITERS_COLLECTION_ID 
} from '../constants.js';

// create a new client
const firestore = new Firestore();
const admin =  requi

export async function createWebinars(req, res, next) {
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

export async function createStudents(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(404).send("Request object missing body")
  }

  const { careerFairObj } = req.body
  const { college, startDate, endDate } = careerFairObj
  careerFairObj.students = {}

  let careerFairId = college.concat(startDate, endDate).toString('base64')
  
  firestore
    .collection(CAREER_FAIR_STUDENTS_COLLECTION_ID)
    .doc(careerFairId)
    .set(careerFairObj)
    .then(() => {
      console.log(`Career fair students entry with id ${careerFairId} added`)
      return res.status(200).send(`Career fair students entry with id ${careerFairId} added`)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error creating career fair students entry with id ${careerFairId}`)
    })
}

export async function createRecruiters(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(404).send("Request object missing body")
  }

  const { careerFairObj } = req.body
  const { college, startDate, endDate } = careerFairObj
  careerFairObj.recruiters = {}

  let careerFairId = college.concat(startDate, endDate).toString('base64')
  
  firestore
    .collection(CAREER_FAIR_RECRUITERS_COLLECTION_ID)
    .doc(careerFairId)
    .set(careerFairObj)
    .then(() => {
      console.log(`Career fair recruiters entry with id ${careerFairId} added`)
      return res.status(200).send(`Career fair recruiters entry with id ${careerFairId} added`)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error creating career fair recruiters entry with id ${careerFairId}`)
    })
}

export async function getWebinars(req, res, next) {
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

export async function getStudents(req, res, next) {
  if (!req.params) {
    console.log("Request object missing params")
    return res.status(404).send("Request object missing params")
  }

  const careerFairId  = req.params.careerFairId || ''
  
  firestore
    .collection(CAREER_FAIR_STUDENTS_COLLECTION_ID)
    .doc(careerFairId)
    .get()
    .then(careerFairObj => {
      careerFairObj = careerFairObj.data()
      console.log(JSON.stringify(careerFairObj))
      return res.status(200).json(careerFairObj)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting career fair students entry with id ${careerFairId}`)
    })
}

export async function getRecruiters(req, res, next) {
  if (!req.params) {
    console.log("Request object missing params")
    return res.status(404).send("Request object missing params")
  }

  const careerFairId  = req.params.careerFairId || ''
  
  firestore
    .collection(CAREER_FAIR_RECRUITERS_COLLECTION_ID)
    .doc(careerFairId)
    .get()
    .then(careerFairObj => {
      careerFairObj = careerFairObj.data()
      console.log(JSON.stringify(careerFairObj))
      return res.status(200).json(careerFairObj)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting career fair recruiters entry with id ${careerFairId}`)
    })
}

export async function addWebinar(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const careerFairId  = req.params.careerFairId || ''
  const { webinarId } = req.body
  
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
}

export async function deleteWebinar(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const careerFairId  = req.params.careerFairId || ''
  const { webinarId } = req.body
  
  firestore
    .collection(CAREER_FAIR_WEBINARS_COLLECTION_ID)
    .doc(careerFairId)
    .update(
      { webinars: admin.firestore.FieldValue.arrayRemove(webinarId) }
    ).then(() => {
      console.log(`Webinar with id ${webinarId} successfully deleted`)
      return res.status(200).send(`Webinar with id ${webinarId} successfully deleted`)
    })
    .catch(error => {
      console.error(error)
      res.status(error.response.status || 404).send(`Error deleting webinar with id ${webinarId}`)
    })
}

export async function addRecruiter(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const careerFairId  = req.params.careerFairId || ''
  const { recruiterId } = req.body
  const recruiterObj = {
    recruiterId : {
      meetings: [],
      webinars: [],
      active: true
    }
  }
  
  firestore
    .collection(CAREER_FAIR_RECRUITERS_COLLECTION_ID)
    .doc(careerFairId)
    .set(recruiterObj, { merge: true })
    .then(() => {
      console.log(`Recruiter with id ${recruiterId} successfully added`)
      return res.status(200).send(`Recruiter with id ${recruiterId} successfully added`)
    })
    .catch(error => {
      console.error(error)
      res.status(error.response.status || 404).send(`Error adding recruiter with id ${recruiterId}`)
    })
}

export async function addStudent(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const careerFairId  = req.params.careerFairId || ''
  const { studentId } = req.body
  const studentObj = {
    studentId : {
      meetings: [],
      webinars: [],
      active: true
    }
  }
  
  firestore
    .collection(CAREER_FAIR_STUDENTS_COLLECTION_ID)
    .doc(careerFairId)
    .set(studentObj, { merge: true })
    .then(() => {
      console.log(`Student with id ${studentId} successfully added`)
      return res.status(200).send(`Student with id ${studentId} successfully added`)
    })
    .catch(error => {
      console.error(error)
      res.status(error.response.status || 404).send(`Error adding student with id ${studentId}`)
    })
}

export async function deleteRecruiter(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const careerFairId  = req.params.careerFairId || ''
  const { recruiterId } = req.body
  const recruiterObj = {
    recruiterId : {
      meetings: [],
      webinars: [],
      active: false
    }
  }
  
  firestore
    .collection(CAREER_FAIR_RECRUITERS_COLLECTION_ID)
    .doc(careerFairId)
    .set(recruiterObj, { merge: true })
    .then(() => {
      console.log(`Recruiter with id ${recruiterId} successfully deleted`)
      return res.status(200).send(`Recruiter with id ${recruiterId} successfully deleted`)
    })
    .catch(error => {
      console.error(error)
      res.status(error.response.status || 404).send(`Error deleting recruiter with id ${recruiterId}`)
    })
}

export async function deleteStudent(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const careerFairId  = req.params.careerFairId || ''
  const { studentId } = req.body
  
  const studentObj = {
    studentId : {
      meetings: [],
      webinars: [],
      active: false
    }
  }
  
  firestore
    .collection(CAREER_FAIR_STUDENTS_COLLECTION_ID)
    .doc(careerFairId)
    .set(studentObj, { merge: true })
    .then(() => {
      console.log(`Student with id ${studentId} successfully deleted`)
      return res.status(200).send(`Student with id ${studentId} successfully deleted`)
    })
    .catch(error => {
      console.error(error)
      res.status(error.response.status || 404).send(`Error deleting student with id ${studentId}`)
    })
}

export async function getRecruiterById(req, res, next) {
  if (!req.params) {
    console.log("Request object missing params")
    return res.status(404).send("Request object missing params")
  }

  const careerFairId  = req.params.careerFairId || ''
  const recruiterId = req.params.recruiterId || ''

  firestore
    .collection(CAREER_FAIR_RECRUITERS_COLLECTION_ID)
    .doc(careerFairId)
    .get()
    .then(recruiter => {
      recruiter = recruiter.data()
      if (recruiter && recruiter.active) {
        console.log(`Recruiter with id ${recruiterId} found\n`, recruiter)
        return res.status(200).json(recruiter)
      }

      console.log(`Recruiter with id ${recruiterId} does not exist`)
      return res.status(404).send(`Recruiter with id ${recruiterId} does not exist`)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error fetching recruiter with id ${recruiterId}`)
    })
}

export async function getStudentById(req, res, next) {
  if (!req.params) {
    console.log("Request object missing params")
    return res.status(404).send("Request object missing params")
  }

  const careerFairId  = req.params.careerFairId || ''
  const studentId = req.params.studentId || ''

  firestore
    .collection(CAREER_FAIR_STUDENTS_COLLECTION_ID)
    .doc(careerFairId)
    .get()
    .then(student => {
      student = student.data()
      if (student && student.active) {
        console.log(`Student with id ${studentId} found\n`, student)
        return res.status(200).json(student)
      }

      console.log(`Student with id ${studentId} does not exist`)
      return res.status(404).send(`Student with id ${studentId} does not exist`)
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error fetching student with id ${studentId}`)
    })
}

export async function updateRecruiter(req, res, next) {
  if (!req.params || !req.body) {
    console.log("Request object missing body or params")
    return res.status(404).send("Request object missing body or params")
  }

  const careerFairId  = req.params.careerFairId || ''
  const recruiterId = req.params.recruiterId || ''
  const { meetings, webinars } = req.body 

  firestore
    .collection(CAREER_FAIR_RECRUITERS_COLLECTION_ID)


}

export async function updateStudent(req, res, next) {

}




