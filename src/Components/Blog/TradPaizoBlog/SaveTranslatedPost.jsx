import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'; 
import { db } from '/src/environments/firebase-config';

const saveTranslatedPost = async (postData, postId) => {
  try {
    if (postId) {
      const postRef = doc(db, 'translatedPosts', postId);
      await updateDoc(postRef, {
        ...postData,
      });
      console.log("Translated post updated successfully!");
    } else {
      await addDoc(collection(db, 'translatedPosts'), {
        ...postData,
        translatedPostDate: serverTimestamp(),
      });
      console.log("Translated post added successfully!");
    }
    return true;
  } catch (error) {
    console.error("Error saving translated post: ", error);
    return false;
  }
};

export default saveTranslatedPost;