import React, { useState, useEffect } from 'react';
import { db } from '/src/environments/firebase-config';
import { collection, addDoc, query, orderBy, where, onSnapshot, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '/src/contexts/AuthContext';

import { FiEdit3 } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

import styles from './CommentSection.module.css'


const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { currentUser } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "comments"), where("postId", "==", postId), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setComments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [postId]);

  const submitComment = async () => {
    if (!newComment.trim()) return;

    const userProfileDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (!userProfileDoc.exists()) {
      console.log("No such user profile!");
      return;
    }
    const userProfile = userProfileDoc.data();

    await addDoc(collection(db, "comments"), {
      text: newComment,
      timestamp: new Date(),
      authorUid: currentUser.uid,
      authorName: userProfile.username,
      authorPic: userProfile.profileImageUrl,
      postId, // Link the comment to the post
    });
    setNewComment("");
  };

  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const submitEdit = async () => {
    const commentRef = doc(db, "comments", editingId);
    await updateDoc(commentRef, {
      text: editText,
    });
    setEditingId(null);
    setEditText("");
  };

  const deleteComment = async (id) => {
    const commentRef = doc(db, "comments", id);
    await deleteDoc(commentRef);
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  return (
    <article className={styles.articleContainer}>
      {!currentUser && (
        <p>You must be logged in to post comments.</p>
      )}
      <div>
        {comments.map(comment => (
          <section className={styles.commentSectionContainer} key={comment.id}>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{comment.authorName}</span>
              <img className={styles.authorPic} src={comment.authorPic} alt={comment.authorName} />
            </div>
            <div className={styles.commentContainer}>
              {editingId === comment.id ? (
                <div className={styles.textAreaContainer}>
                  <textarea
                    className={styles.textarea}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button className={styles.postCommentButton} onClick={submitEdit}>Enregistrer</button>
                  <button className={styles.postCommentButton} onClick={cancelEditing}>Annuler</button>
                </div>
              ) : (
                <span className={styles.comment}>{comment.text}</span>
              )}
              {currentUser && (currentUser.uid === comment.authorUid || userData.role === 'admin') && editingId !== comment.id && (
                <div className={styles.buttonContainer}>
                  <button className={styles.editButton} onClick={() => startEditing(comment)}><FiEdit3 className={styles.icon} /></button>
                  <button className={styles.deleteButton} onClick={() => deleteComment(comment.id)}><MdDeleteForever className={styles.icon} /></button>
                </div>
              )}
              <div className={styles.commentDate}><i>posté le {formatDate(comment.timestamp)}</i></div>
              <hr className={styles.hr}></hr>
            </div>
          </section>
        ))}
        <section className={styles.textAreaContainer}>
          <textarea
            className={styles.textarea}
            placeholder="Écrivez votre commentaire ici..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className={styles.postCommentButton} onClick={submitComment}>Submit Comment</button>
        </section>
      </div>
    </article>
  );
};

export default CommentSection;