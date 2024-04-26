import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomQuillEditor from '/src/Components/CustomQuillEditor/CustomQuillEditor';
import saveTranslatedPost from '/src/Components/Blog/TradPaizoBlog/SaveTranslatedPost';
import { useAuth } from '/src/contexts/AuthContext';
import { db } from '/src/environments/firebase-config';
import { serverTimestamp, getDoc, doc, where, getDocs, deleteDoc, collection, query } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

import 'react-quill/dist/quill.snow.css';
import styles from '../stylesBlog/BlogPostForm.module.css';

const TranslatedBlogPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [postData, setPostData] = useState({
    title: '',
    originalPostDate: '',
    originalPostLink: '',
    content: '',
    translatedPostAuthor: userData?.uid || '',
    cardImageUrl: '',
  });

  const [image, setImage] = useState(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState({
    message: '',
    isSuccess: null,
    type: '',
  });
  const [inputKey, setInputKey] = useState(Date.now());
  const [initialImageUrls, setInitialImageUrls] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFeedback({
        message: "Type de fichier invalide. Seul les JPEG, PNG et WEBP sont acceptés.",
        isSuccess: false,
        type: 'validationError',
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFeedback({
        message: "Le fichier est trop lourd. La taille maximum est de 5MB.",
        isSuccess: false,
        type: 'validationError',
      });
      return;
    }

    setImage(file);
    setFeedback({ message: "", isSuccess: null, type: "" });
  };

  const resetForm = () => {
    setImage(null);
    setUploadProgress(0);
    setPostData({
      title: '',
      originalPostDate: '',
      originalPostLink: '',
      content: '',
      translatedPostAuthor: userData?.uid || '',
      cardImageUrl: '',
    });
    setInputKey(Date.now());
    setFeedback({ message: "", isSuccess: null, type: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let newPostData = { ...postData, translatedPostAuthor: userData?.uid || '' };

    if (!postId) {
      newPostData.translatedPostDate = serverTimestamp();
    }

    try {
      if (image) {
        const uploadResult = await uploadImage(image);
        newPostData.cardImageUrl = uploadResult;
      }

      const currentImageUrls = extractImageUrls(postData.content);
      if (postData.cardImageUrl) {
        currentImageUrls.push(postData.cardImageUrl);
      }

      const urlsToDelete = initialImageUrls.filter(url => !currentImageUrls.includes(url));

      if (urlsToDelete.length > 0) {
        await deleteAssociatedImages(urlsToDelete);
      }

      const success = await saveTranslatedPost(newPostData, postId);
      handlePostSubmissionResult(success);
    } catch (error) {
      console.error('Error submitting post:', error);
      setFeedback({
        message: 'Erreur lors de la soumission du post. Veuillez réessayer.',
        isSuccess: false,
        type: 'networkError',
      });
    }
  };

  const uploadImage = async (image) => {
    const uniqueImageName = `${Date.now()}_${image.name}`;
    const storage = getStorage();
    const storageRef = ref(storage, `images/${uniqueImageName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed: ', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL: ', error);
            reject(error);
          }
        }
      );
    });
  };

  const extractImageUrls = (content) => {
    const imgRegex = /<img src="(https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"]+)"[^>]*>/g;
    let urls = [];
    let match;
    while ((match = imgRegex.exec(content))) {
      urls.push(match[1]);
    }
    return urls;
  };

  const fetchPostData = async () => {
    if (postId) {
      const docRef = doc(db, 'translatedPosts', postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPostData({
          title: data.title || '',
          originalPostDate: data.originalPostDate || '',
          originalPostLink: data.originalPostLink || '',
          content: data.content || '',
          translatedPostAuthor: data.translatedPostAuthor,
          translatedPostDate: data.translatedPostDate,
          cardImageUrl: data.cardImageUrl || '',
        });

        const contentImageUrls = extractImageUrls(data.content);
        const initialUrls = data.cardImageUrl ? [...contentImageUrls, data.cardImageUrl] : [...contentImageUrls];
        setInitialImageUrls(initialUrls);
      } else {
        console.log("No such document!");
        navigate('/tradPaizoBlogCards');
      }
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [postId, navigate]);

  const handlePostSubmissionResult = (success) => {
    if (success) {
      setFeedback({
        message: 'Post publié avec succès!',
        isSuccess: true,
        type: '',
      });
      resetForm();
      navigate('/tradPaizoBlogCards');
    } else {
      setFeedback({
        message: 'Erreur lors de la publication du post. Veuillez réessayer.',
        isSuccess: false,
        type: 'networkError',
      });
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      return;
    }
  
    try {
      const contentImageUrls = extractImageUrls(postData.content);
      if (postData.cardImageUrl) {
        contentImageUrls.push(postData.cardImageUrl); 
      }
  
      if (contentImageUrls.length > 0) {
        await deleteAssociatedImages(contentImageUrls); 
      }
  
      const commentsRef = collection(db, "comments");
      const q = query(commentsRef, where("postId", "==", postId));
      const querySnapshot = await getDocs(q);
      const deleteCommentsPromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteCommentsPromises);
  
      const docRef = doc(db, 'translatedPosts', postId);
      await deleteDoc(docRef);
  
      navigate('/tradPaizoBlogCards');
      console.log("Post, comments, and associated images successfully deleted.");
    } catch (error) {
      console.error("Error deleting post, comments, or images: ", error);
      setFeedback({
        message: 'Erreur lors de la suppression du post, des commentaires ou des images.',
        isSuccess: false,
        type: 'networkError',
      });
    }
  };

  const deleteAssociatedImages = async (urlsToDelete) => {
    const storage = getStorage();
  
    const deletePromises = urlsToDelete.map(async (url) => {
      try {
        const decodedUrl = decodeURIComponent(url);
        const matches = decodedUrl.match(/\/o\/([^?]+)/);
        if (matches) {
          const imagePath = matches[1].replace(/%2F/g, '/');
          const imageRef = ref(storage, imagePath);
          await deleteObject(imageRef);
          console.log(`Deleted image: ${imagePath}`);
        }
      } catch (error) {
        console.error(`Error deleting image: ${url}`, error);
        throw error; 
      }
    });

    await Promise.all(deletePromises);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <h2>Création d'un post de traduction du Paizoblog sur le playtest de Starfinder seconde édition</h2>
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.blogPostForm} key={inputKey}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Titre: </label>
            <input
              type="text"
              name="title"
              id="title"
              value={postData.title}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="originalPostDate">Date du post original: </label>
            <input
              type="text"
              name="originalPostDate"
              id="originalPostDate"
              value={postData.originalPostDate}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="originalPostLink">Lien vers le post original: </label>
            <input
              type="url"
              name="originalPostLink"
              id="originalPostLink"
              value={postData.originalPostLink}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>

          {!postId && (
            <div>
              <label htmlFor="cardImageUrl">Image de la carte: </label>
              <input
                type="file"
                name="cardImageUrl"
                id="cardImageUrl"
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/webp"
                className={styles.formControl}
                key={inputKey}
                required
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="content">Contenu:</label>
            <CustomQuillEditor
              content={postData.content}
              setContent={(content) => setPostData(prevData => ({ ...prevData, content }))}
              className={styles.reactQuill}
              required
            />
          </div>
          {feedback.message && (
            <div className={`${styles.feedbackMessage} ${feedback.isSuccess ? styles.success : styles.error}`}>
              {feedback.message}
            </div>
          )}
          <div className={styles.containerFormButton}>
            <button type="submit" className={styles.formButton}>Publier le post</button>
            <button type="button" onClick={deletePost} className={styles.formButton}>Supprimer le post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TranslatedBlogPostForm;