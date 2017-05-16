// REDIRECT_URI and CLIENT_ID are both references to my app, not the user
const REDIRECT_URI = 'http://localhost:3333'
const CLIENT_ID = '4f9ed3b9afd94c3fbf0536a3a54f7a68'

// If I have more users, they will have to generate their own Auth tokens...
// I would need to put a 'log in' at the beginning, using the AUTH-URL
const AUTH_URL = `https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token
`

// This is hard-coded for now, since it is only my data I have access to
const MY_AUTH_TOKEN = '256450119.4f9ed3b.85b25e00bb864c6aa837a5896060080f';



const MyRecentMedia = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${MY_AUTH_TOKEN}`;

const aboutMe = `https://api.instagram.com/v1/users/self/?access_token=${MY_AUTH_TOKEN}`
