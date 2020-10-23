import express from 'express';
import { 
    addAccessToken, 
    checkIfTokenExpired, 
    deleteAccessToken, 
    getAccessToken, 
    updateAccessToken
} from './src/controllers/tokens.js';
import { 
    fetchAccessToken,
    refreshAccessToken,
    revokeAccessToken
 } from './src/zoomTokens.js';

const router = express.Router()

/* CRUD operations on the tokens DB */
// create an access token and add it to the db
router.post('/tokens', fetchAccessToken, addAccessToken);
// revoke an access token, note that token needs to be valid to be revoked on the zoom api
router.post(
    'tokens/revoke', 
    getAccessToken, 
    checkIfTokenExpired, 
    refreshAccessToken, 
    updateAccessToken,
    revokeAccessToken,
    deleteAccessToken
    )
// create meeting for the user
router.post('/meetings')
// get a list of all scheduled meetings for the user
router.get('/meetings')
// 


export default router