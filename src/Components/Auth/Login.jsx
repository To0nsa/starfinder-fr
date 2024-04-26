import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '/src/environments/firebase-config';
import { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import styles from './Auth.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const db = getFirestore();

  const resendVerificationEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      console.log("Verification mail resend.");
      alert("E-mail de vérification renvoyé. Veuillez vérifier votre boîte de réception.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      setErrorMessage("Erreur lors de l'envoi de l'e-mail de vérification. Veuillez réessayer.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.emailVerified) {
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const username = userDocSnap.data().username;
          console.log("Logged in user:", username);
          navigate('/');
        } else {
          console.log("No user profile found in Firestore.");
        }
      } else {
        console.log("Mail not verified.");
        setErrorMessage(
          <span>
            Votre adresse e-mail n'est pas vérifiée. Veuillez vérifier votre boîte de réception, ou vos courriers indésirables. 
            Si vous ne l'avez pas reçu, <button onClick={resendVerificationEmail} className={styles.resendLink}>cliquez ici</button> pour le renvoyer.
          </span>
        );
        setTimeout(async () => {
          await signOut(auth);
          console.log("User logged out for security reason.");
          alert("Vous avez été déconnecté pour des raisons de sécurité. Veuillez vérifier votre e-mail et vous reconnecter.");
        }, 20000);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setErrorMessage("Échec de la connexion. Vérifiez votre e-mail et votre mot de passe.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Veuillez saisir votre adresse e-mail dans le champ correspondant.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email send.");
      alert("Un e-mail de réinitialisation de mot de passe a été envoyé. Vérifiez votre boîte de réception, ou vos courriers indésirables.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setErrorMessage("Erreur lors de l'envoi de l'e-mail de réinitialisation du mot de passe. Veuillez réessayer.");
    }
  };

  return (
    <main className={styles.mainContainer}>
      <article className={styles.articleContainer}>
        <h1 className={styles.formTitle}>Se connecter</h1>
        <form className={styles.formContainer} onSubmit={handleLogin}>
          <input
            className={styles.formInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse mail"
            required
          />
          <input
            className={styles.formInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          <button className={styles.submitButton} type="submit">Valider</button>
          <p className={styles.forgotPassword} onClick={handleForgotPassword}>Mot de passe oublié?</p>
        </form>
      </article>
    </main>
  );
}

export default Login;