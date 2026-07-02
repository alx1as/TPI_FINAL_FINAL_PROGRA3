import type { IUser } from "../../../types/IUser";
import { obtenerUsuarios } from "../../../data/data";
import { saveSession } from "../../../utils/auth";
import { goToClientHome } from "../../../utils/navigate";

const form = document.querySelector("#registroUser") as HTMLFormElement | null;
const nameInput = document.querySelector("#name") as HTMLInputElement | null;
const emailInput = document.querySelector("#email") as HTMLInputElement | null;
const passwordInput = document.querySelector("#password") as HTMLInputElement | null;

if (!form || !nameInput || !emailInput || !passwordInput) {
    throw new Error("No se encontraron los elementos del formulario");
}

function obtenerUsuariosLocales(): IUser[] {
    const textoUsuarios = localStorage.getItem("users");

    if (!textoUsuarios) return [];

    try {
        return JSON.parse(textoUsuarios) as IUser[];
    } catch {
        return [];
    }
}

function guardarUsuariosLocales(users: IUser[]): void {
    localStorage.setItem("users", JSON.stringify(users));
}

function emailValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (!emailValido(email)) {
        alert("Ingrese un email válido.");
        return;
    }

    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    try {
        const usuariosJson = await obtenerUsuarios();
        const usuariosLocales = obtenerUsuariosLocales();
        const usuarios = [...usuariosJson, ...usuariosLocales];

        if (usuarios.some((user) => user.email.toLowerCase() === email)) {
            alert("El email ya está registrado. Por favor, use otro email.");
            return;
        }

        const newUser: IUser = {
            id: Date.now(),
            name,
            email,
            password,
            role: "client"
        };

        usuariosLocales.push(newUser);
        guardarUsuariosLocales(usuariosLocales);
        saveSession(newUser);

        alert("Registro exitoso.");
        goToClientHome();
    } catch (error) {
        console.error(error);
        alert("No se pudo completar el registro. Intente nuevamente.");
    }
});
