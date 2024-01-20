import { IInitialState } from "./Main";

export interface IStoreDoc extends IStore {
    id: string
}

export interface IStore extends IInitialState {
    name: string //ชื่อร้าน
    img_logo: string //โลโก้ร้าน
}