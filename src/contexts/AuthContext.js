import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"
import { firestore } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import * as fbAuth from 'firebase/auth';

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  async function signup(email, password) {
    let res = await fbAuth.createUserWithEmailAndPassword(auth, email, password);

    let userProps = {
      id: res.user.uid,
      toReadList: []
    };

    await setDoc(doc(firestore, "/users", res.user.uid), userProps);
    return res;
  }

  function login(email, password) {
    return fbAuth.signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return fbAuth.signOut(auth)
  }

  function updateEmail(email) {
    return fbAuth.updateEmail(auth.currentUser, email)
  }

  function updatePassword(password) {
    return fbAuth.updatePassword(auth.currentUser, password)
  }

  useEffect(async () => {
    const unsubscribe = await fbAuth.onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
