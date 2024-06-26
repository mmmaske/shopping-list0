import { User } from "../models/user";

export function loginDetails(): User {
    const token = localStorage.getItem('user')
    const user = token ? JSON.parse(token) : '';
    return user;
}

export function debug(debuggable:any): void {
    console.log(`debug: ${String(debuggable)}`);
    console.log(typeof(debuggable));
    console.log(debuggable);
}