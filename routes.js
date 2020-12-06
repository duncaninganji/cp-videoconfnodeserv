import express from 'express';
import * as tokensAPI from './src/controllers/tokens.js';
import * as zoomOauthAPI from './src/zoom/zoomTokens.js';
import * as meetingsAPI from './src/zoomAPI/meetings.js';
import * as webinarsAPI from './src/zoomAPI/webinars.js';
import * as studentsDB from './src/controllers/students.js';
import * as recruitersDB from './src/controllers/recruiters.js';

const router = express.Router()

// middleware to check for and refresh expired access tokens
router.use(['/tokens/*', '/careerFairs/*'],
  tokensAPI.getAccessToken, 
  tokensAPI.checkIfTokenExpired, 
  zoomOauthAPI.refreshAccessToken, 
  tokensAPI.updateAccessToken,
  )

// create an access token and add it to the db
router.post('/tokens/', zoomOauthAPI.fetchAccessToken, tokensAPI.addAccessToken);
// revoke an access token, note that token needs to be valid to be revoked on the zoom api
router.post('/tokens/revoke/', zoomOauthAPI.revokeAccessToken, tokensAPI.deleteAccessToken)


/* CRUD operations for students */
// create a student entry in a career fair
router.get('/careerFairs/students/:careerFairId/:userId', studentsDB.dbCreateStudent)
// delete a student entry from the career fair
router.delete('/careerFairs/students/:careerFairId/:userId', studentsDB.dbDeleteStudent)
// student signs up for a webinar
// the userId used to check for the access token is the recruiter's id
router.post('/careerFairs/students/:careerFairId/:webinarId/:userId', 
  webinarsAPI.addWebinarRegistrants,
  webinarsAPI.getWebinar, 
  studentsDB.dbUpdateWebinars
)
// student signs up for 1-1 with recruiter
router.post('/careerFairs/students/:careerFairId/:recruiterId/:studentId',
  meetingsAPI.createMeeting,
  recruitersDB.dbUpdateMeetings,
  studentsDB.dbUpdateMeetings
)
// get students schedule
router.get('/careerFairs/students/:careerFairId/:userId', studentsDB.getSchedule)



/* CRUD operations for recruiter */
// create a recruiter entry in a career fair
router.get('/careerFairs/recruiters/:careerFairId/:userId', recruitersDB.dbCreateRecruiter)
// delete a recruiter entry from the career fair
router.delete('/careerFairs/recruiters/:careerFairId/:userId', recruitersDB.dbDeleteRecruiter)
// recruiter creates a webinar
// the userId used to check for the access token is the recruiter's id
router.post('/careerFairs/recruiters/:careerFairId/:webinarId/:userId', 
  webinarsAPI.createWebinar,
  recruitersDB.getRecruiter, 
  recruitersDB.dbUpdateWebinars
)
// gets recruiter's schedule
router.get('/careerFairs/recruiters/:careerFairId/:userId', recruitersDB.getSchedule)

export default router