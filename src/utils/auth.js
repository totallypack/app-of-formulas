import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './client';

const signIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const { user } = result;
      console.log('User signed in:', user);
    })
    .catch((error) => {
      console.error('Error during sign-in:', error);
    });
};

const signOut = () => {
  auth
    .signOut()
    .then(() => {
      console.log('User signed out');
    })
    .catch((error) => {
      console.error('Error during sign-out:', error);
    });
};

export { signIn, signOut };
