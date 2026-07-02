import { IUser } from "../types/IUser";

// obtiene el usuario actualmente logueado
export function getCurrentUser(): IUser | null {
    const userData = localStorage.getItem("userData");

    if (!userData) return null;

    try {
        return JSON.parse(userData) as IUser;
    } catch {
        return null;
    }
}

// guarda la sesión actual
//evito guardar la contraseña en userData
export function saveSession(user: IUser): void {
    const { password: _password, ...userData } = user;
    localStorage.setItem("userData", JSON.stringify(userData));
}

// elimina la sesión
export function clearSession(): void {
    localStorage.removeItem("userData");
}

// devuelve true o false según haya usuario logueado
export function isAuthenticated(): boolean {
    return getCurrentUser() !== null;
}

export function configurarLogout(): void {
    const botonLogout = document.getElementById("logout-btn") as HTMLButtonElement | null;

    if (!botonLogout) return;

    botonLogout.addEventListener("click", () => {
        clearSession();
        window.location.href = "/src/pages/auth/login/login.html";
    });
}