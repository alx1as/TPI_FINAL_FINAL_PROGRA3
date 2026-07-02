import type { IUser } from "../../../types/IUser";
import { obtenerUsuarios } from "../../../data/data";
import { saveSession } from "../../../utils/auth";
import { goToAdminHome, goToClientHome } from "../../../utils/navigate";

// Login contra usuarios.json + usuarios registrados en localStorage.

// 1. Traigo email y contraseña del formulario.
const form = document.querySelector("#loginUser") as HTMLFormElement | null;
const emailInput = document.querySelector("#email") as HTMLInputElement | null;
const passwordInput = document.querySelector("#password") as HTMLInputElement | null;

// 2. Verifico que existan en el DOM.
if (!form || !emailInput || !passwordInput) {
    throw new Error("No se encontraron los elementos del formulario");
}

// 3. Leo usuarios creados desde el registro.
// Estos usuarios no pueden guardarse en usuarios.json porque el navegador no puede escribir archivos del proyecto.
function obtenerUsuariosLocales(): IUser[] {
    const textoUsuarios = localStorage.getItem("users");

    if (!textoUsuarios) {
        return [];
    }

    try {
        return JSON.parse(textoUsuarios) as IUser[];
    } catch {
        return [];
    }
}

// 4. Escucho el submit del formulario.
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try {
        // Usuarios iniciales del sistema: admin y clientes de prueba
        const usuariosJson = await obtenerUsuarios();

        // Usuarios creados desde el registro
        const usuariosLocales = obtenerUsuariosLocales();

        // Ambas fuentes unidas
        const usuarios = [...usuariosJson, ...usuariosLocales];

        // Busco coincidencia por email y contraseña
        const userEncontrado = usuarios.find((user) => {
            return user.email.toLowerCase() === email && user.password === password;
        });

        if (!userEncontrado) {
            alert("El email o contraseña están incorrectos.");
            return;
        }

        // Guardo sesión. La función saveSession elimina la contraseña antes de guardar
        saveSession(userEncontrado);

        // Redirecciono según rol
        if (userEncontrado.role === "admin") {
            goToAdminHome();
        } else {
            goToClientHome();
        }
    } catch (error) {
        console.error(error);
        alert("No se pudo iniciar sesión. Intente nuevamente.");
    }
});