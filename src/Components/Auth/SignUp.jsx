import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '/src/environments/firebase-config';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

import styles from './Auth.module.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!validatePassword(newPassword)) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères et inclure au moins une minuscule, une majuscule, un chiffre et un caractère spécial.");
    } else {
      setErrorMessage('');
    }
  };

  const handleVerifyPasswordChange = (e) => {
    const newVerifyPassword = e.target.value;
    setVerifyPassword(newVerifyPassword);
    if (password && newVerifyPassword !== password) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
    } else {
      setErrorMessage('');
    }
  };

  const register = async (e) => {
    e.preventDefault();
    if (errorMessage || password !== verifyPassword) {
      console.log("Validation failed", { errorMessage });
      return;
    }

    try {
      console.log("Creating user with Firebase Auth");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Firebase Auth user created successfully", userCredential.user.uid);
      console.log("Setting user document in Firestore");
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        username,
        email,
        role: 'user'
      });
      console.log("User document set in Firestore");

      await sendEmailVerification(userCredential.user)
        .then(() => {
          console.log("Verification email sent.");
          setErrorMessage("Utilisateur enregisté et e-mail de vérification envoyé. Veuillez vérifier votre adresse mail avant de vous connecter, vérifiez vos courriers indésirables.");
          setTimeout(() => {
            navigate('/login');
          }, 10000);
        })
        .catch((error) => {
          console.error("Error sending verification email:", error);
          setErrorMessage("Erreur lors de l'envoi de l'e-mail de vérification.");
        });

      await signOut(auth);

    } catch (error) {
      console.error("Registration error", error);
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage("Cet e-mail est déjà utilisé par un autre compte.");
      } else {
        setErrorMessage("Une erreur s'est produite lors de l'inscription.");
      }
    }
  };

  return (
    <main className={styles.mainContainer}>
      <article className={styles.articleContainer}>
        <h1 className={styles.formTitle}>S'enregistrer</h1>
        <form className={styles.formContainer} onSubmit={register}>
          <input className={styles.formInput}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            required />
          <input className={styles.formInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse mail"
            required />
          <input className={styles.formInput}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Mot de passe"
            required />
          <input className={styles.formInput}
            type="password"
            value={verifyPassword}
            onChange={handleVerifyPasswordChange}
            placeholder="Vérifier le mot de passe"
            required />
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          <button className={styles.submitButton} type="submit">Valider</button>
        </form>
      </article>
    </main>
  );
}

export default SignUp;