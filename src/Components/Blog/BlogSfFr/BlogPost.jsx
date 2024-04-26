import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '/src/environments/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import DOMPurify from 'dompurify';

import CommentSection from '../CommentSection';

import styles from '../stylesBlog/BlogPost.module.css';

const BlogPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();
          const sanitizedContent = DOMPurify.sanitize(postData.content);
          const postDate = postData.postDate?.toDate() ? postData.postDate.toDate() : new Date();
          const readablePostDate = postDate.toLocaleDateString("fr-FR");

          setPost({
            id: postSnap.id,
            ...postData,
            content: sanitizedContent,
            readablePostDate,
          });
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (post && post.postAuthor) {
        const docRef = doc(db, "users", post.postAuthor);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
        } else {
          console.log("No such user!");
        }
      }
    };

    if (post) {
      fetchUsername();
    }
  }, [post, db]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className={styles.mainContainer} key={post.id}>
      <Link to="/blogCards" className={styles.previousButton}>Retour aux cartes des postes</Link>
      <div className={styles.articleContainer}>
        <h1>{post.title}</h1>
        <div className={styles.articleContent} dangerouslySetInnerHTML={{ __html: post.content }} />
        <h3 className={styles.postInfo}>Posté par {username} le {post.readablePostDate}.</h3>
      </div>
      <CommentSection postId={postId}/>
    </div>
  );
};

export default BlogPost;