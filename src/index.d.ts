import { IUser } from "./types/user.types"

declare global {
    export namespace Express {
        export interface Request {
            user: IUser
        }
    }
}
