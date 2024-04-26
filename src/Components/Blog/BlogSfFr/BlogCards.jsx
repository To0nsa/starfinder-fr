import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '/src/environments/firebase-config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '/src/contexts/AuthContext';

import { FiEdit3 } from "react-icons/fi";

import styles from '../stylesBlog/BlogCards.module.css'

const BlogCards = () => {
  const [posts, setPosts] = useState([]); // State to hold blog posts
  const { userData, isLoggedIn } = useAuth(); // Extracting user data and login status from the Auth context

  useEffect(() => {
    const postsCollectionRef = collection(db, 'posts'); // References the 'posts' collection in Firestore
    const q = query(postsCollectionRef, orderBy('postDate', 'desc')); // Creates a query that orders posts by date in descending order

    // Real-time subscription to the query
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Mapping over the documents returned by the query
      const postsArray = querySnapshot.docs.map((doc) => {
        const data = doc.data(); // Extracting data from the document
        // Converts the Firestore timestamp to a JavaScript Date object
        const postDate = data.postDate?.toDate() ? data.postDate.toDate() : new Date();
        // Formats the date to a readable string
        const readablePostDate = postDate.toLocaleDateString("fr-FR");
        // Returns an object representing the post with an added readable date
        return {
          id: doc.id,
          ...data,
          readablePostDate,
        };
      });
      setPosts(postsArray); // Updates the state with the fetched posts
    });

    // Cleanup function to unsubscribe from the real-time updates
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on component mount

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <h1>Blog Starfinder-FR sur le playtest de Starfinder seconde édition</h1>
      </div>
      {isLoggedIn && (
        <div className={styles.buttonContainer}>
          <Link to="/blogForm">
            <button className={styles.addPostButton} type="submit">Créer un post</button>
          </Link>
        </div>
      )}
      <div className={styles.postGrid}> 
        {posts.map((post) => (
          <div className={styles.post} key={post.id}>
            <Link to={`/posts/${post.id}`}>
              {post.cardImageUrl && <img className={styles.postImage} src={post.cardImageUrl} alt="Post" />}
              <div className={styles.postInfo}>
                <h2 className={styles.postDate}>{post.readablePostDate}</h2>
                <h1 className={styles.postTitle}>{post.title}</h1>
              </div>
            </Link>
            {userData && (userData.uid === post.postAuthor || userData.role === 'admin') && (
              <button className={styles.editButton}>
                <Link to={`/edit-post/${post.id}`}><FiEdit3 className={styles.editIcon} /></Link>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCards;