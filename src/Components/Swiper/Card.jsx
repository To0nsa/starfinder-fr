import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit3 } from "react-icons/fi";
import styles from '/src/Components/Blog/stylesBlog/BlogCards.module.css';
import { useAuth } from '/src/contexts/AuthContext';

const Card = ({ post }) => {
  const { userData } = useAuth();

  return (
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
  );
};

export default Card;