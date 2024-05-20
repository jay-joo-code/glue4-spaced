import firebase from 'firebase';
import 'firebase/storage';
import { FIREBASE_API_KEY } from '$env/static/private';
import Compressor from 'compressorjs';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: 'cornlet-prod.firebaseapp.com',
  databaseURL: 'https://cornlet-prod.firebaseio.com',
  projectId: 'cornlet-prod',
  storageBucket: 'cornlet-prod.appspot.com',
  messagingSenderId: '88125142899',
  appId: '1:88125142899:web:59480abcd4cf2bd7eb7706',
  measurementId: 'G-045Z67SPL6'
};

firebase.initializeApp(firebaseConfig);

// REJECT: Upload error
// RESOLVE: Img download url
const uploadFile = (file: File, directory: string) =>
  new Promise((resolve, reject) => {
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const path = `${directory}/${file.name}`;

    // compress file
    new Compressor(file, {
      quality: 0.6,
      convertSize: 1,
      success(result) {
        const uploadTask = storageRef.child(path).put(result);
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (e) => {
            // TODO: log errors to database
            reject(e);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((src) => {
              resolve(src);
            });
          }
        );
      },
      error(err) {
        // TODO: log errors to database
        reject(err);
      }
    });
  });

export default firebase;
export { uploadFile };
