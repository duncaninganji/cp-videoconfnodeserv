import axios from 'axios';
import qs from 'qs';


// req object should have the zoomId as well as the userId
// token should have been added to the body of the request object 
// before this by the fetchAccessToken function
export async function createMeeting(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(400).send("Request object missing body")
  }

  const { zoomId, userId, token } = req.body
  const url = `https://api.zoom.us/v2/users/${zoomId}/meetings`
  const headers = {
    'Content-Transfer-Encoding': 'application/json',
    'Authorization': `Bearer ${token}`
  }
  // TODO: Fill in default values for the body
  const body = {}

  const options = {
    method: 'POST',
    url,
    body,
  }

  axios(options)
    .then(meetingObj => {
      console.log(JSON.stringify(meetingObj));
      return res.status(200).json(meetingObj.response.data);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error creating meeting for user with zoom id ${zoomId}`)
    })

}

export async function getMeeting(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or")
  }

  const { zoomId, userId, token } = req.body
  const meetingId = req.params.meetingId || ''
  const url = `https://api.zoom.us/v2/meetings/${meetingId}`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'GET',
    url,
  }

  axios(options)
    .then(meetingObj => {
      console.log(JSON.stringify(meetingObj));
      return res.status(200).json(meetingObj.response.data);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting meeting with id ${meetingId}`)
    })
}

// could paginate the output if we wanted to
export async function getAllMeetingsForUser(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(400).send("Request object missing body")
  }

  const { zoomId, userId, token } = req.body
  const url = `https://api.zoom.us/v2/users/${zoomId}/meetings`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'GET',
    headers,
    url,
  }

  axios(options)
    .then(meetingsList => {
      console.log(JSON.stringify(meetingsList));
      return res.status(200).json(meetingsList.response.data);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting meetings for user with zoom id ${zoomId}`)
    })
} 

export async function updateMeeting(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { zoomId, userId, token, updateObj } = req.body
  const meetingId = req.params.meetingId || ''
  const url = `https://api.zoom.us/v2/meetings/${meetingId}`
  const headers = {
    'Content-Transfer-Encoding': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'PATCH',
    body: updateObj,
    headers,
    url
  }

  axios(options)
    .then(() => {
      console.log(`Meeting with id${meetingId} successfully updated`);
      return res.status(200).send(`Meeting with id${meetingId} successfully updated`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting updating meeting with id ${meetingId}`)
    })
}

// currently unused in the API
export async function updateMeetingStatus(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { zoomId, userId, token, updateObj } = req.body
  const meetingId = req.params.meetingId || ''
  const url = `https://api.zoom.us/v2/meetings/${meetingId}`
  const headers = {
    'Content-Transfer-Encoding': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'PATCH',
    body: updateObj,
    headers,
    url
  }

  axios(options)
    .then(() => {
      console.log(`Meeting with id${meetingId} successfully updated`);
      return res.status(200).send(`Meeting with id${meetingId} successfully updated`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting updating meeting with id ${meetingId}`)
    })
}

export async function deleteMeeting(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { zoomId, userId, token } = req.body
  const meetingId = req.params.meetingId || ''
  const url = `https://api.zoom.us/v2/meetings/${meetingId}`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'DELETE',
    params: qs.stringify({
      'schedule_for_reminder': true,
      'cancel_meeting_reminder': true
    }),
    headers,
    url
  }

  axios(options)
    .then(() => {
      console.log(`Meeting with id${meetingId} successfully deleted`);
      return res.status(200).send(`Meeting with id${meetingId} successfully deleted`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting deleting meeting with id ${meetingId}`)
    })
}

export async function listMeetingRegistrants(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { zoomId, userId, token } = req.body
  const meetingId = req.params.meetingId || ''
  const url = `https://api.zoom.us/v2/meetings/${meetingId}/registrants`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'GET',
    params: qs.stringify({
      'status': 'approved'
    }),
    headers,
    url,
  }

  axios(options)
    .then(registrantsList => {
      console.log(JSON.stringify(registrantsList));
      return res.status(200).json(registrantsList.response.data);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting registrants for meeting with id ${meetingId}`)
    })
}

export async function updateMeetingRegistrants(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { zoomId, userId, token, updateObj } = req.body
  const meetingId = req.params.meetingId || ''
  const url = `https://api.zoom.us/v2/meetings/${meetingId}/registrants/status`
  const headers = {
    'Content-Transfer-Encoding': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'PUT',
    body: updateObj,
    headers,
    url,
  }

  axios(options)
    .then(() => {
      console.log(`Registrants for meeting with id ${meetingId} updated`);
      return res.status(200).send(`Registrants for meeting with id ${meetingId} updated`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error updating registrants for meeting with id ${meetingId}`)
    })
}