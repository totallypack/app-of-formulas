// /api/userData.js
import { ref, update, serverTimestamp } from 'firebase/database';
import { database } from '@/utils/client';

const UpdateUserData = async (userObj) => {
  try {
    const userRef = ref(database, `/user/${userObj.uid}`);

    await update(userRef, {
      uid: userObj.uid,
      name: userObj.displayName || '',
      email: userObj.email || '',
      photoURL: userObj.photoURL || '',
      lastLogin: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};

export default UpdateUserData;
