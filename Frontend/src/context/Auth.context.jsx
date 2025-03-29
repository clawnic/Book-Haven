import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut 
} from "firebase/auth";

const AuthContext =  createContext();

export const useAuth = () => {
    return useContext(AuthContext)
}

const googleProvider = new GoogleAuthProvider();

// authProvider
export const AuthProvide = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // register a user
    const registerUser = async (email,password) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    }

    // login the user
    const loginUser = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password)
    }

    // sing up with google
    const signInWithGoogle = async () => {
        return await signInWithPopup(auth, googleProvider);
    };

    useEffect(() => {
        const handleRedirectSignIn = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    setCurrentUser(result.user);
                }
            } catch (error) {
                console.error("Redirect sign in error:", error);
            }
        };

        handleRedirectSignIn();
    }, []);

    // logout the user
    const logout = () => {
        return signOut(auth)
    }

    // manage user
    useEffect(() => {
        const unsubscribe =  onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            if(user) {
               
                const {email, displayName, photoURL} = user;
                const userData = {
                    email, username: displayName, photo: photoURL
                } 
            }
        })

        return () => unsubscribe();
    }, [])


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