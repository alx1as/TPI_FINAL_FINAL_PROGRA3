import { Rol } from "./Rol";

export interface IUser {
    id?: number;
    name?: string;
    surname?: string;
    phone?: string;
    email: string;
    password?: string;
    role: Rol;
}
