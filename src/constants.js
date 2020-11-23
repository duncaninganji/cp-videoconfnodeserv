export const TOKENS_COLLECTION_ID = 'tokens';

export const CAREER_FAIR_STUDENTS_COLLECTION_ID = 'students';

export const CAREER_FAIR_RECRUITERS_COLLECTION_ID = 'recruiters';

export const CAREER_FAIR_WEBINARS_COLLECTION_ID = 'careerfair_webinars';

export const ZOOM_ACCESS_TOKEN_URL = 'https://zoom.us/oauth/token';

export const ZOOM_REVOKE_ACCESS_URL = 'https://zoom.us/oauth/revoke';

export const ZOOM_REDIRECT_URI = 'https://204fe418ada2.ngrok.io';

export const ZOOM_CREDENTIALS = {
  "client_id": "n2ZxYlJaR22vsCZf0nSZkQ",
  "client_secret": "yhiTLIpKx31tfjxUUjz2eT9kV2oqzOF1"
}

export const ZOOM_AUTH_HEADER = Buffer.from(ZOOM_CREDENTIALS.client_id.concat(':', ZOOM_CREDENTIALS.client_secret)).toString('base64');