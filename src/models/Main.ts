import { IUserDoc } from "./User"

export interface IInitialState {
    created_at?: Date
    updated_at?: Date
    // admin_create_id?: IUserDoc
    // agent_create_id?: IUserDoc
    // manager_create_id?: IUserDoc
    // user_create_id?: IUserDoc
    admin_create_id?: String
    agent_create_id?: String
    manager_create_id?: String
    user_create_id?: String
}