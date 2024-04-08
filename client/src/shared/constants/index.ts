export const routerList = {
    HOME: "/",
    AUTH: "/auth",
    CONVERSATION: "/conversation/:id",
}

export const localStorageKeys = {
    THEME: "theme",
    TOKEN: "token",
}

export const passwordRules: Array<{ rule: (password: string) => boolean, message: string }> = [
    {
        rule: (password: string) => /[A-Z]/.test(password),
        message: "Password must contain at least one uppercase letter",
    },
    {
        rule: (password: string) => /[a-z]/.test(password),
        message: "Password must contain at least one lowercase letter",
    },
    {
        rule: (password: string) => /[0-9]/.test(password),
        message: "Password must contain at least one number",
    }, 
    {
        rule: (password: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
        message: "Password must contain at least one special character",
    }
]