import React, { useEffect, useRef, useState } from 'react'
import { stateModal } from '../../redux/features/modal/modalSlice'
import { useDispatch } from 'react-redux'
import { Modal } from '../modal/Modal'
import { io } from '../../utils/socket-io'
import { useAppSelector } from '../../redux/hooks'
import axios from 'axios'
import { axiosConfig } from '../../utils/headers'
import { IStore } from '../../models/Store'
import { IUser, TUserRoleEnum } from '../../models/User'

type Props = {}

const ManageStores = (props: Props) => {
    interface IUserDoc extends IUser {
        id: string
    }
    const dispatch = useDispatch()
    const [storesAll, setStoresAll] = useState<IStore[]>([])
    const [userAgentAll, setUserAgentAll] = useState<IUserDoc[]>([])
    const ownerRef = useRef<HTMLSelectElement>(null);
    const storeNameRef = useRef<HTMLInputElement>(null);

    const fetchStoresAll = () => {
        try {
            return axios.get(`${import.meta.env.VITE_OPS_URL}/get/store`, axiosConfig)
                .then((response) => {
                    const data: IStore[] = response.data
                    setStoresAll(data)

                })
        } catch (error) {
        }
    }

    const fetchUserAgentAll = () => {
        try {
            return axios.get(`${import.meta.env.VITE_OPS_URL}/get/user/role/` + TUserRoleEnum.AGENT, axiosConfig)
                .then((response) => {
                    const data: IUserDoc[] = response.data
                    setUserAgentAll(data)
                })
        } catch (error) {
        }
    }

    const openModal = () => {
        fetchUserAgentAll()
        dispatch(stateModal({ show: true, openModal: "CONFIG", confirm: true }))
    }

    const addStore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (ownerRef.current!.value && storeNameRef.current!.value) {
            const [agentData] = userAgentAll.filter((res) => res.id === ownerRef.current!.value)

            let agent: IUserDoc | {} = {}
            if (agentData.role === TUserRoleEnum.AGENT) {
                agent = {
                    fullname: agentData.fullname,
                    id: agentData.id,
                    role: agentData.role,
                    status: agentData.status,
                    admin_create_id: agentData.admin_create_id,
                    user_create_id: agentData.user_create_id,
                    credit: agentData.credit,
                    username: agentData.username
                }
            }


            const store: IStore = {
                agent_create_id: agent as IUserDoc,
                img_logo: "data.img_logo",
                name: storeNameRef.current!.value,
            }

            return axios.post(`${import.meta.env.VITE_OPS_URL}/add/store`, store, axiosConfig)
                .then((res) => {
                    if (res.data.length > 0) {
                        console.log("username has been used");
                    } else {
                        io.emit("create_store")
                        dispatch(stateModal({ show: false, openModal: "CONFIG" }))
                        console.log("success");
                    }
                })
        }
    }

    useEffect(() => {
        io.on("get_store", () => {
            fetchStoresAll()
        })

        return () => {
            io.off('get_store')
            fetchStoresAll()
        };
    }, [])

    return (
        <>
            <button onClick={openModal} className="mb-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">เพิ่มร้าน</button>
            <div className="text-gray-900 bg-gray-200">
                <div className="p-4 flex">
                    <h1 className="text-3xl">
                        ร้านทั้งหมด
                    </h1>
                </div>
                <div className="px-3 py-4 w-full">
                    <table className="text-md bg-white shadow-md rounded mb-4">
                        <thead>
                            <tr className="border-b">
                                <th className="text-center p-3 px-5">#</th>
                                <th className="text-center p-3 px-5">ชื่อร้าน</th>
                                <th className="text-center p-3 px-5">เจ้าของร้าน</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {storesAll.map((store, index) => (
                                <tr key={index} className="border-b hover:bg-orange-100 bg-gray-100 text-center">
                                    <td className="p-3" width={"5%"}>{index + 1}</td>
                                    <td className="p-3" width={"25%"}>{store.name}</td>
                                    <td className="p-3" width={"25%"}>{store.user_create_id!.fullname}</td>
                                    <td className="p-3 flex justify-end"><button type="button" className="mr-3 text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">แก้ไข</button><button type="button" className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">ลบ</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal>
                <section>
                    <div className="flex flex-col items-center justify-center  mx-auto lg:py-0">
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex w-full justify-between">
                                <h1 className="p-6 text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    เพิ่มร้าน
                                </h1>
                                <button data-modal-hide="default_modal" onClick={() => dispatch(stateModal({ show: false, openModal: "CONFIG" }))} className="text-xs text-gray-400 hover:text-gray-300 font-bold p-2 rounded shadow mx-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <form className="space-y-4 md:space-y-6">
                                    <div>
                                        <label htmlFor="owner" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เจ้าของร้าน</label>
                                        <select ref={ownerRef} name="owner" id="owner" className='w-full border rounded p-3'>
                                            {userAgentAll.map((user, index) => (
                                                <option key={index} value={user.id}>{user.fullname}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="store_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อร้าน</label>
                                        <input ref={storeNameRef} type="text" name="store_name" id="store_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ชื่อร้าน" required />
                                    </div>
                                    <button type="submit" onClick={addStore} className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">เพิ่มร้าน</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </Modal>
        </>
    )
}

export default ManageStores