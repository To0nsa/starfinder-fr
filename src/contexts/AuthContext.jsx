import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '/src/environments/firebase-config';
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!currentUser;

  const fetchUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      console.log("No such document!");
      setUserData({});
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        fetchUserData(user.uid);
      } else {
        setUserData({});
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = () => {
    signOut(auth).then(() => {
      console.log("User signed out");
    }).catch((error) => {
      console.error("Sign out error", error);
    });
  };

  const value = {
    currentUser,
    isLoggedIn,
    userData,
    logout,
    loading,
  };

  if (loading) {
    return <></>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};