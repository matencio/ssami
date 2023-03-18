import { User } from "./user";

export interface Sesion {
    token: string;
    usuario: User;
}