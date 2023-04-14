import { User } from "./types/User"

declare global {
    export namespace Express {
        export interface Request {
            user: User
        }
    }
}
