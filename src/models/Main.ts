import { IUserDoc } from "./Id"


export interface IInitialState {
    created_at?: Date | FirebaseTimestamp
    updated_at?: Date | FirebaseTimestamp
    admin_create_id?: IUserDoc
    agent_create_id?: IUserDoc
    manager_create_id?: IUserDoc
    user_create_id?: IUserDoc
    // admin_create_id?: string
    // agent_create_id?: string
    // manager_create_id?: string
    // user_create_id?: string
}

export interface FirebaseTimestamp { seconds: number | string, nanoseconds: number | string }
