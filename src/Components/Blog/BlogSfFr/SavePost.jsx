import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'; 
import { db } from '/src/environments/firebase-config';

const SavePost = async (postData, postId) => {
  try {
    if (postId) {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        ...postData,
      });
      console.log("Post updated successfully!");
    } else {
      await addDoc(collection(db, 'posts'), {
        ...postData,
        postDate: serverTimestamp(),
      });
      console.log("Post added successfully!");
    }
    return true;
  } catch (error) {
    console.error("Error saving post: ", error);
    return false;
  }
};

export default SavePost;