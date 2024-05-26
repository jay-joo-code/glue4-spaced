import Compressor from 'compressorjs';

// REJECT: Upload error
// RESOLVE: Img download url
// TODO: replace any with firebase type
const uploadFile = (file: File, directory: string, firebase: any) =>
  new Promise<string>((resolve, reject) => {
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
            // TODO: handle errors
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
        // TODO: handle errors
        reject(err);
      }
    });
  });

export default uploadFile;
