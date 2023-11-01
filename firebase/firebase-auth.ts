import { getAuth } from "firebase-admin/auth";

const uid = "670kRey8kbgF86SD1bTGaLWTFyI2"

getAuth()
  .getUser(uid)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });
