import { 
    signIn, 
    confirmSignIn, 
    fetchAuthSession,  
    getCurrentUser, 
    signOut,
    signUp,
    confirmSignUp,
    resendSignUpCode,
    resetPassword,
    confirmResetPassword,
    fetchUserAttributes,
    type FetchUserAttributesOutput
} from "aws-amplify/auth";

export const login = async (username: string, password: string) => {
    try {
        // Verificar si ya hay sesión
        await getCurrentUser();

        // Si llega aquí, ya hay usuario autenticado
        console.log("Ya hay usuario autenticado, cerrando sesión...");
        await signOut();

    } catch {
        // No hay usuario autenticado, todo bien
    }

    // Ahora sí hacer login
    return await signIn({ username, password });
};

export const confirmMfa = async (code: string) => {
    return await confirmSignIn({
        challengeResponse: code
    });
};

export const getToken = async () => {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();
};

// Registro de usuario
export const register = async (email: string, password: string, name: string) => {
    return await signUp({
        username: email,
        password,
        options: {
            userAttributes: {
                email,
                name,
            },
        },
    });
};

// Confirmar registro con código
export const confirmRegistration = async (email: string, code: string) => {
    return await confirmSignUp({
        username: email,
        confirmationCode: code,
    });
};

// Reenviar código de confirmación
export const resendConfirmationCode = async (email: string) => {
    return await resendSignUpCode({
        username: email,
    });
};

// Solicitar reset de password (envía código al email)
export const requestPasswordReset = async (email: string) => {
    return await resetPassword({
        username: email,
    });
};

// Confirmar nuevo password con código
export const confirmPasswordReset = async (
    email: string, 
    code: string, 
    newPassword: string
) => {
    return await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
    });
};

// Obtener usuario actual
export const getCurrentUserInfo = async () => {
    const user = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    return {
        username: user.username,
        userId: user.userId,
        ...attributes,
    };
};

// Obtener atributos del usuario
export const getUserAttributes = async (): Promise<FetchUserAttributesOutput> => {
    return await fetchUserAttributes();
};

// Cerrar sesión
export const logout = async () => {
    return await signOut();
};
