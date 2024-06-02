import Compressor from 'compressorjs';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// REJECT: Upload error
// RESOLVE: Img download url
// TODO: replace any with firebase type
const uploadFile = (file: File, directory: string, firebase: any) =>
  new Promise<string>((resolve, reject) => {
    const storage = getStorage(firebase);
    const path = `${directory}/${file.name}`;
    const storageRef = ref(storage, path);

    // compress file
    new Compressor(file, {
      quality: 0.6,
      convertSize: 1,
      success(result) {
        const uploadTask = uploadBytesResumable(storageRef, result);
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      },
      error(error) {
        reject(error);
      }
    });
  });

export default uploadFile;
