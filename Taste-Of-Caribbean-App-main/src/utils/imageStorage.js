import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';

const storage = getStorage(app);

export const uploadImage = async (file, fileName) => {
  try {
    const storageRef = ref(storage, `menu-images/${fileName}`);
    const response = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(response.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getImageUrl = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
};
