import { db } from '../firebase/config'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth'
import { useEffect, useState } from 'react'

export const useAuthentication = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    //cleanup
    //deal with memory leak
    const [cancelled, setCancelled] = useState(false)

    const auth = getAuth();

    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }
    }

    // REGISTER
    const createUser = async (data) => {
        checkIfIsCancelled()

        setLoading(true)

        try {

            const { user } = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            await updateProfile(user, {
                displayName: data.displayName
            })

            setLoading(false)
            return user;

        } catch (error) {
            console.log(error.message)
            console.log(typeof error.message)

            let systemErrorMessage

            if (error.message.includes("Password")) {
                systemErrorMessage = "A sua senha precisa conter pelo menos 6 caracteres."
            } else if (error.message.includes("email-already")) {
                systemErrorMessage = "E-mail já cadastrado."
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde."
            }

            setError(systemErrorMessage)
            setLoading(false)
        }
    }


    // LOGOUT
    const logout = () => {
        checkIfIsCancelled();

        signOut(auth);
    }

    // LOGIN
    const login = async (data) => {
        checkIfIsCancelled()

        setLoading(true)
        setError(false)

        try {
            await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            )
            setError(false)
        } catch (error) {
            let systemErrorMessage;
            if (error.message.includes("user-not-found")) {
                systemErrorMessage = "Usuário não encontrado"
            } else if (error.message.includes("wrong-password")) {
                systemErrorMessage = "Senha incorreta"
            } else {
                systemErrorMessage = "Ocorreu um erro, favor tentar mais tarde"
            }

            setLoading(false)
            setError(systemErrorMessage);

        }
    }


    useEffect(() => {
        return () => setCancelled(true)
    }, []);

    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login,
    }

}