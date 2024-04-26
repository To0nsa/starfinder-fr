import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/contexts/AuthContext';
import { storage, db } from '/src/environments/firebase-config';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";

import { FiEdit3 } from "react-icons/fi";

import styles from './Profilepage.module.css';

const ProfilePage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [hover, setHover] = useState(false)
  const [showModal, setShowModal] = useState(false);;
  const [file, setFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [signUpDate, setSignUpDate] = useState('');
  const readableSignUpDate = new Date(signUpDate).toLocaleDateString("fr-FR");
  const [discordName, setDiscordName] = useState('');
  const [editingState, setEditingState] = useState({
    discordName: false,
  });
  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);
  const openModal = () => setShowModal(true);
  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setHover(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.profileImageName) {
            const profilePicRef = ref(storage, userData.profileImageName);
            getDownloadURL(profilePicRef)
              .then((url) => {
                setProfileImageUrl(url);
              })
              .catch((error) => {
                console.error("Failed to fetch profile image:", error);
                setProfileImageUrl('');
              });
          }
          setDiscordName(userData.discordName);
          const creationTime = currentUser.metadata.creationTime;
          setSignUpDate(creationTime);
        } else {
          console.log("No such document!");
        }
      }).catch(error => {
        console.error("Error getting document:", error);
      });
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !currentUser || isUploading) return;
    setIsUploading(true);
    const userDocRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.profileImageName) {
        const oldProfilePicRef = ref(storage, userData.profileImageName);
        await deleteObject(oldProfilePicRef).catch(error => console.error("Error deleting old profile picture:", error));
      }
    }
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `profilePictures/${currentUser.uid}/${currentUser.uid}_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, uniqueFileName);
    try {
      await uploadBytes(storageRef, file);
      const imageURL = await getDownloadURL(storageRef);
      setProfileImageUrl(imageURL);
      console.log('Uploaded and URL is', imageURL);
      await updateDoc(userDocRef, {
        profileImageUrl: imageURL,
        profileImageName: uniqueFileName,
      });
    } catch (error) {
      console.error("Error uploading file: ", error);
    } finally {
      setIsUploading(false);
      setHover(false);
      setShowModal(false);
    }
  };

  const toggleEditing = (field) => {
    setEditingState(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleUpdate = async (field, newValue) => {
    if (!currentUser || !currentUser.uid) {
      console.error('No user is currently signed in.');
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid);
    try {
      await updateDoc(userDocRef, {
        [field]: newValue,
      });
      console.log(`Successfully updated ${field}:`, newValue);
      if (field === 'discordName') {
        setDiscordName(newValue);
      }
      toggleEditing(field);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const deleteAccount = async () => {
    if (!currentUser) return;
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      return;
    }
    try {
      const profilePicRef = ref(storage, `profilePictures/${currentUser.uid}`);
      await deleteObject(profilePicRef).catch(error => console.error("Error deleting profile picture:", error));
      const userDocRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userDocRef);
      await currentUser.delete().then(() => {
        console.log("Account deleted successfully.");
        navigate('/homepage');
      }).catch((error) => {
        console.error("Error deleting account from Firebase Authentication:", error);
      });
    } catch (error) {
      console.error("Error during account deletion process:", error);
    }
  };

  return (
    <main className={styles.mainContainer}>
      <article className={styles.articleContainer}>
        <section className={styles.profileImageContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={openModal}>
          {profileImageUrl ? (
            <img className={styles.profileImage} src={profileImageUrl} alt="Profile image" />
          ) : (
            <div className={styles.noProfileImage}>
              Ajouter une image de profil
            </div>
          )}
          {hover && profileImageUrl && (
            <div className={styles.imageOverlay}>
              Changer l'image de profil
            </div>
          )}
          {showModal && (
            <div className={styles.modal} onClick={closeModal}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <span className={styles.closeButton} onClick={() => setShowModal(false)}>&times;</span>
                <h1 className={styles.modalTitle}>Changer votre image de profil</h1>
                <p>Le site est en construction, veuillez choisir une image déjà ronde un token par exemple, après tout on est des rôlistes !</p>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Mettre à jour</button>
              </div>
            </div>
          )}
        </section>
        <section className={styles.infoUser}>
          <p>Nom d'utilisateur: {userData.username || 'Utilisateur'} </p>
          {editingState.discordName ? (
            <div>
              <input
                type="text"
                value={discordName}
                onChange={(e) => setDiscordName(e.target.value)}
              />
              <button onClick={() => handleUpdate('discordName', discordName)}>Mettre à jour</button>
              <button onClick={() => toggleEditing('discordName')}>Annuler</button>
            </div>
          ) : (
            <p>Pseudo Discord: {discordName} <button className={styles.editButton} onClick={() => toggleEditing('discordName')}><FiEdit3 className={styles.editIcon} /></button></p>
          )}
          <p>Inscrit le {readableSignUpDate}</p>
          <button onClick={deleteAccount} className={styles.deleteAccountButton}>Supprimer le compte</button>
        </section>
      </article>
    </main>
  );
};

export default ProfilePage;