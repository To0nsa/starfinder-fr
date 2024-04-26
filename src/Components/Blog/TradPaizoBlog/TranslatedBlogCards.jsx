import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '/src/environments/firebase-config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '/src/contexts/AuthContext';

import { FiEdit3 } from "react-icons/fi";

import styles from '../stylesBlog/BlogCards.module.css'

const TranslatedBlogCards = () => {
  const [posts, setPosts] = useState([]);
  const { userData, isLoggedIn } = useAuth();

  useEffect(() => {
    const postsCollectionRef = collection(db, 'translatedPosts');
    const q = query(postsCollectionRef, orderBy('translatedPostDate', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <h1>Traduction des posts du Paizoblog sur le playtest de Starfinder seconde édition</h1>
      </div>
      {isLoggedIn && (
        <div className={styles.buttonContainer}>
          <Link to="/tradPaizoBlogForm">
            <button className={styles.addPostButton} type="submit">Créer un post</button>
          </Link>
        </div>
      )}
      <div className={styles.postGrid}> 
        {posts.map((post) => (
          <div className={styles.post} key={post.id}>
            <Link to={`/tradPaizoBlogposts/${post.id}`}>
              {post.cardImageUrl && <img className={styles.postImage} src={post.cardImageUrl} alt="Post" />}
              <div className={styles.postInfo}>
                <h2 className={styles.postDate}>{post.originalPostDate}</h2>
                <h1 className={styles.postTitle}>{post.title}</h1>
              </div>
            </Link>
            {userData && (userData.uid === post.translatedPostAuthor || userData.role === 'admin') && (
              <button className={styles.editButton}>
                <Link to={`/edit-tradPaizoBlogPost/${post.id}`}><FiEdit3 className={styles.editIcon} /></Link>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslatedBlogCards;