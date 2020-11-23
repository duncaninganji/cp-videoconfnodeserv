import express from 'express';
import * as tokensAPI from './src/controllers/tokens.js';
import * as zoomOauthAPI from './src/zoomTokens.js';
import * as meetingsAPI from './src/zoomMeetings.js';
import * as webinarsAPI from './src/zoomWebinars.js';
import * as careerFairsAPI from './src/controllers/careerfairs.js';

const router = express.Router()

// middleware to check for and refresh expired access tokens
router.use(['/tokens/revoke','/meetings/*', '/webinars/*'],
  tokensAPI.getAccessToken, 
  tokensAPI.checkIfTokenExpired, 
  zoomOauthAPI.refreshAccessToken, 
  tokensAPI.updateAccessToken,
  )

// create an access token and add it to the db
router.post('/tokens/', zoomOauthAPI.fetchAccessToken, tokensAPI.addAccessToken);
// revoke an access token, note that token needs to be valid to be revoked on the zoom api
router.post('/tokens/revoke/', zoomOauthAPI.revokeAccessToken, tokensAPI.deleteAccessToken)

/* CRUD operations on meetings */
// create meeting for the user
router.post('/meetings/',meetingsAPI.createMeeting)
// get a meeting by id
router.get('/meetings/:meetingId',meetingsAPI.getMeeting)
// get all meetings for the user
router.get('/meetings/users', meetingsAPI.getAllMeetingsForUser)
// update meeting details
router.patch('/meetings/:meetingId', meetingsAPI.updateMeeting)
// delete meeting
router.delete('/meetings/:meetingId', meetingsAPI.deleteMeeting)
// get meeting registrants
router.get('/meetings/registrants/:meetingId', meetingsAPI.listMeetingRegistrants)
// update meeting registrants
router.put('/meetings/registrants/:meetingId', meetingsAPI.updateMeetingRegistrants)


/* CRUD operations on webinars */
// create a webinar for the user
router.post('/webinars/', webinarsAPI.createWebinar)
// get a webinar by id
router.get('/webinars/:webinarID', webinarsAPI.getWebinar)
// get all webinars for the user
router.get('/webinars/users', webinarsAPI.getAllWebinarsForUser)
// update webinar details
router.patch('/webinars/:webinarId', webinarsAPI.updateWebinar)
// delete webinar
router.delete('/webinars/:webinarId', webinarsAPI.deleteWebinar)
// list webinar panelists
router.get('/webinars/panelists/:webinarId', webinarsAPI.listWebinarPanelists)
// add panelists to webinar
router.post('/webinars/panelists/:webinarId', webinarsAPI.addPanelists)
// remove panelist from webinar
router.delete('/webinars/panelists/:webinarId/:panelistId', webinarsAPI.removePanelist)
// remove all panelists from webinar
router.delete('/webinars/panelists/:webinarId', webinarsAPI.removeAllPanelists)
// list webinar registrants
router.get('/webinars/registrants/:webinarId', webinarsAPI.listWebinarRegistrants)
// add registrants to webinar
router.post('/webinars/registrants/:webinarId', webinarsAPI.addWebinarRegistrants)
// update webinar registrants
router.put('/webinars/registrants/:webinarId', webinarsAPI.updateWebinarRegistrants)


// get all available webinars for a career fair
router.get('/careerfairs/webinars/:careerfairId', careerFairsAPI.getWebinars)

// get the schedule for a particular user
router.get('/careerfairs/schedules/:careerfairId/:userId', careerFairsAPI.getScheduleById)

export default router