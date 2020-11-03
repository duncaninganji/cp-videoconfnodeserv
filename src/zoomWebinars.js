import axios from 'axios';
import qs from 'qs';


// req object should have the zoomId as well as the userId
// token should have been added to the body of the request object 
// before this by the fetchAccessToken function
export async function createWebinar(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(400).send("Request object missing body")
  }

  const { zoomId, userId, token } = req.body
  const url = `https://api.zoom.us/v2/users/${zoomId}/webinars`
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
    .then(webinarObj => {
      console.log(JSON.stringify(webinarObj));
      return res.status(200).json(webinarObj.response.data);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error creating webinar for user with zoom id ${zoomId}`)
    })

}

export async function getWebinar(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { zoomId, userId, token } = req.body
  const webinarId = req.params.webinarId || ''
  const url = `https://api.zoom.us/v2/webinars/${webinarId}`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'GET',
    url,
  }

  axios(options)
    .then(webinarObj => {
      console.log(JSON.stringify(webinarObj));
      return res.status(200).json(webinarObj.response.data);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting webinar with id ${webinarId}`)
    })
}

// could paginate the output if we wanted to
export async function getAllWebinarsForUser(req, res, next) {
  if (!req.body) {
    console.log("Request object missing body")
    return res.status(400).send("Request object missing body")
  }

  const { zoomId, userId, token } = req.body
  const url = `https://api.zoom.us/v2/users/${zoomId}/webinars`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'GET',
    headers,
    url,
  }

  axios(options)
    .then(webinarsList => {
      console.log(JSON.stringify(webinarsList));
      return res.status(200).json(webinarsList.response.data);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting webinars for user with zoom id ${zoomId}`)
    })
} 

export async function updateWebinar(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { zoomId, userId, token, updateObj } = req.body
  const webinarId = req.params.webinarId || ''
  const url = `https://api.zoom.us/v2/webinars/${webinarId}`
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
      console.log(`Webinar with id${webinarId} successfully updated`);
      return res.status(200).send(`Webinar with id${webinarId} successfully updated`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting updating webinar with id ${webinarId}`)
    })
}

export async function updateWebinarStatus(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { zoomId, userId, token, updateObj } = req.body
  const webinarId = req.params.webinarId || ''
  const url = `https://api.zoom.us/v2/webinars/${webinarId}`
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
      console.log(`Webinar with id${webinarId} successfully updated`);
      return res.status(200).send(`Webinar with id${webinarId} successfully updated`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting updating webinar with id ${webinarId}`)
    })
}

export async function deleteWebinar(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { zoomId, userId, token } = req.body
  const webinarId = req.params.webinarId || ''
  const url = `https://api.zoom.us/v2/webinars/${webinarId}`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'DELETE',
    params: qs.stringify({
      'cancel_webinar_reminder': true
    }),
    headers,
    url
  }

  axios(options)
    .then(() => {
      console.log(`Webinar with id${webinarId} successfully deleted`);
      return res.status(200).send(`Webinar with id${webinarId} successfully deleted`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting deleting webinar with id ${webinarId}`)
    })
}

export async function listWebinarPanelists(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { zoomId, userId, token } = req.body
  const webinarId = req.params.webinarId || ''
  const url = `https://api.zoom.us/v2/webinars/${webinarId}/panelists`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'GET',
    headers,
    url,
  }

  axios(options)
    .then(panelists => {
      console.log(JSON.stringify(panelists));
      return res.status(200).json(panelists.response.data);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error getting panelists for webinar with id ${webinarId}`)
    })
}

export async function addPanelists(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { token, panelists} = req.body
  const webinarId = req.params.webinarId || ''
  const url = `https://api.zoom.us/v2/webinars/${webinarId}/panelists`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'POST',
    body: panelists,
    headers,
    url,
  }

  axios(options)
    .then(() => {
      console.log(`Panelists successfully added to ${webinarId}`);
      return res.status(200).send(`Panelists successfully added to ${webinarId}`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error adding panelists for webinar with id ${webinarId}`)
    })
}

export async function removePanelist(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { token } = req.body
  const webinarId = req.params.webinarId || ''
  const panelistId = req.params.panelistId || ''
  const url = `https://api.zoom.us/v2/webinars/${webinarId}/panelists/${panelistId}`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'DELETE',
    body: panelists,
    headers,
    url,
  }

  // returns 200 if webinar plan subscription is missing
  // returns 204 if panelist is successfully deleted
  axios(options)
    .then(() => {
      console.log(`Panelist with id ${panelistId} successfully deleted from ${webinarId}`);
      return res.status(200).send(`Panelist with id ${panelistId} successfully deleted from ${webinarId}`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error deleting panelist with id ${panelistId} from webinar with id ${webinarId}`)
    })
}

export async function removeAllPanelists(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { token } = req.body
  const webinarId = req.params.webinarId || ''
  const url = `https://api.zoom.us/v2/webinars/${webinarId}/panelists`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'DELETE',
    body: panelists,
    headers,
    url,
  }

  // returns 200 if webinar plan subscription is missing
  // returns 204 if panelist is successfully deleted
  axios(options)
    .then(() => {
      console.log(`All Panelists successfully deleted from webinar with id ${webinarId}`);
      return res.status(200).send(`All Panelists successfully deleted from webinar with id ${webinarId}`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error deleting panelists from webinar with id ${webinarId}`)
    })
}

export async function listWebinarRegistrants(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { token } = req.body
  const webinarId = req.params.webinarId || ''
  const url = `https://api.zoom.us/v2/webinars/${webinarId}/registrants`
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
      return res.status(error.response.status || 404).send(`Error getting registrants for webinar with id ${webinarId}`)
    })
}

export async function addWebinarRegistrants(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { token, registrantsObj} = req.body
  const webinarId = req.params.webinarId || ''
  const url = `https://api.zoom.us/v2/webinars/${webinarId}/registrants`
  const headers = {
    'Content-Transfer-Encoding': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  const options = {
    method: 'POST',
    body: registrantsObj,
    headers,
    url,
  }

  axios(options)
    .then(() => {
      console.log(`Registrants added to webinar with id ${webinarId}`);
      return res.status(200).send(`Registrants added to webinar with id ${webinarId}`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error adding registrants to webinar with id ${webinarId}`)
    })
}

export async function updateWebinarRegistrants(req, res, next) {
  if (!req.body || !req.params) {
    console.log("Request object missing body or params")
    return res.status(400).send("Request object missing body or params")
  }

  const { token, updateObj} = req.body
  const webinarId =  req.params.webinarId
  const url = `https://api.zoom.us/v2/webinars/${webinarId}/registrants/status`
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
      console.log(`Updated registrants for webinar with id ${webinarId}`);
      return res.status(200).send(`Updated registrants for webinar with id ${webinarId}`);
    })
    .catch(error => {
      console.error(error)
      return res.status(error.response.status || 404).send(`Error adding registrant to webinar with id ${webinarId}`)
    })
}