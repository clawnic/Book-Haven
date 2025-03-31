import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup,
    signOut 
} from "firebase/auth";

import axios from 'axios';
import getBaseUrl from '../utils/baseURl';

const AuthContext =  createContext();

export const useAuth = () => {
    const context= useContext(AuthContext);

    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

const googleProvider = new GoogleAuthProvider();

// authProvider
export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const syncUserWithMongoDB = async (user) => {
        try {
            // Only sync if we have user data
            if (!user?.email) {
                console.log("No user data to sync");
                return;
            }
    
            const userData = {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
    
            const response = await axios.post(`${getBaseUrl()}/auth/sync-user`, userData);
            console.log("Sync response:", response.data.message);
    
            return response.data.user;
        } catch (error) {
            console.error("Sync error:", error);
            return null;
        }
    };

    // sign up with google
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                await syncUserWithMongoDB(result.user);
            }
            return result;
        } catch (error) {
            console.error("Google sign in error:", error);
            throw error;
        }
    };

    const registerUser = async (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Login user
    const loginUser = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // manage user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const dbUser = await syncUserWithMongoDB(user);
                setCurrentUser({ ...user, ...dbUser });
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);

    // logout the user
    const logout = () => {
        return signOut(auth)
    }
    const value = {
        currentUser,
        loading,
        registerUser,
        loginUser,
        signInWithGoogle,
        logout
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}