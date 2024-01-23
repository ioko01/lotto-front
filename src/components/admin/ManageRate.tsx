import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { axiosConfig } from '../../utils/headers'
import { io } from '../../utils/socket-io'
import { IUser, IUserDoc, TUserRoleEnum, TUserStatusEnum } from '../../models/User'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { stateModal } from '../../redux/features/modal/modalSlice'
import { Modal } from '../modal/Modal'
import { TUserRole } from '../../models/User'
import { IStore } from '../../models/Store'
import { ILottoDoc } from '../member/Home'
import { IRate } from '../../models/Rate'

type Props = {}

interface IStoreDoc extends IStore {
    id: string
}

const ManageRate = (props: Props) => {
    const [ratesAll, setRatesAll] = useState<IRate[]>([])
    const modal = useAppSelector(state => state.modal)
    const dispatch = useAppDispatch()
    const [store, setStore] = useState<string>("")
    const [lotto, setLotto] = useState<string>("")
    const [storesAll, setStoresAll] = useState<IStoreDoc[]>([])
    const [lottosAll, setLottosAll] = useState<ILottoDoc[]>([])

    const oneTopRef = useRef<HTMLInputElement>(null);
    const oneTopMinRef = useRef<HTMLInputElement>(null);
    const oneTopMaxRef = useRef<HTMLInputElement>(null);
    const oneTopLimitRef = useRef<HTMLInputElement>(null);
    const oneBottomRef = useRef<HTMLInputElement>(null);
    const oneBottomMinRef = useRef<HTMLInputElement>(null);
    const oneBottomMaxRef = useRef<HTMLInputElement>(null);
    const oneBottomLimitRef = useRef<HTMLInputElement>(null);
    const twoTopRef = useRef<HTMLInputElement>(null);
    const twoTopMinRef = useRef<HTMLInputElement>(null);
    const twoTopMaxRef = useRef<HTMLInputElement>(null);
    const twoTopLimitRef = useRef<HTMLInputElement>(null);
    const twoBottomRef = useRef<HTMLInputElement>(null);
    const twoBottomMinRef = useRef<HTMLInputElement>(null);
    const twoBottomMaxRef = useRef<HTMLInputElement>(null);
    const twoBottomLimitRef = useRef<HTMLInputElement>(null);
    const threeTopRef = useRef<HTMLInputElement>(null);
    const threeTopMinRef = useRef<HTMLInputElement>(null);
    const threeTopMaxRef = useRef<HTMLInputElement>(null);
    const threeTopLimitRef = useRef<HTMLInputElement>(null);
    const threeBottomRef = useRef<HTMLInputElement>(null);
    const threeBottomMinRef = useRef<HTMLInputElement>(null);
    const threeBottomMaxRef = useRef<HTMLInputElement>(null);
    const threeBottomLimitRef = useRef<HTMLInputElement>(null);
    const commissionOneTopRef = useRef<HTMLInputElement>(null);
    const commissionOneBottomRef = useRef<HTMLInputElement>(null);
    const commissionTwoTopRef = useRef<HTMLInputElement>(null);
    const commissionTwoBottomRef = useRef<HTMLInputElement>(null);
    const commissionThreeTopRef = useRef<HTMLInputElement>(null);
    const commissionThreeBottomRef = useRef<HTMLInputElement>(null);

    const storeRef = useRef<HTMLSelectElement>(null);
    const lottoRef = useRef<HTMLSelectElement>(null);

    const addRate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (oneTopRef.current!.value
            && oneBottomRef.current!.value
            && twoTopRef.current!.value
            && twoBottomRef.current!.value
            && threeTopRef.current!.value
            && threeBottomRef.current!.value) {
            const getStore = storesAll.find((store) => store.id == storeRef.current!.value)
            const getLotto = lottosAll.find((lotto) => lotto.id == lottoRef.current!.value)
            const data: IRate = {
                store_id: getStore!,
                lotto_id: getLotto!,
                one_digits: { top: oneTopRef.current!.value, bottom: oneBottomRef.current!.value },
                two_digits: { top: twoTopRef.current!.value, bottom: twoBottomRef.current!.value },
                three_digits: { top: threeTopRef.current!.value, toad: threeBottomRef.current!.value },
                bet_one_digits: { top: `${oneTopMinRef.current!.value}:${oneTopMaxRef.current!.value}:${oneTopLimitRef.current!.value}`, bottom: `${oneBottomMinRef.current!.value}:${oneBottomMaxRef.current!.value}:${oneBottomLimitRef.current!.value}` },
                bet_two_digits: { top: `${twoTopMinRef.current!.value}:${twoTopMaxRef.current!.value}:${twoTopLimitRef.current!.value}`, bottom: `${twoBottomMinRef.current!.value}:${twoBottomMaxRef.current!.value}:${twoBottomLimitRef.current!.value}` },
                bet_three_digits: { top: `${threeTopMinRef.current!.value}:${threeTopMaxRef.current!.value}:${threeTopLimitRef.current!.value}`, toad: `${threeBottomMinRef.current!.value}:${threeBottomMaxRef.current!.value}:${threeBottomLimitRef.current!.value}` },
                committion: {
                    one_digits: {
                        top: commissionOneTopRef.current!.value,
                        bottom: commissionOneBottomRef.current!.value
                    },
                    two_digits: {
                        top: commissionTwoTopRef.current!.value,
                        bottom: commissionTwoBottomRef.current!.value
                    },
                    three_digits: {
                        top: commissionThreeTopRef.current!.value,
                        toad: commissionThreeBottomRef.current!.value
                    }
                },
            }
            axios.post(`${import.meta.env.VITE_OPS_URL}/add/rate`, data, axiosConfig)
                .then((res) => {
                    dispatch(stateModal({ show: false, openModal: "CONFIG", confirm: true }))
                })
        }
    }

    const openModal = () => {
        fetchStoresAll()
        fetchLottosAll()
        dispatch(stateModal({ show: true, openModal: "CONFIG", confirm: true }))
    }

    const fetchStoresAll = () => {
        try {
            axios.get(`${import.meta.env.VITE_OPS_URL}/get/store`, axiosConfig)
                .then((response) => {
                    setStoresAll(response.data)
                })
        } catch (error) {
        }
    }

    const fetchLottosAll = () => {
        try {
            axios.get(`${import.meta.env.VITE_OPS_URL}/get/lotto/all`, axiosConfig)
                .then((response) => {
                    setLottosAll(response.data)
                })
        } catch (error) {
        }
    }

    const fetchRatesAll = () => {
        try {
            axios.get(`${import.meta.env.VITE_OPS_URL}/get/lotto/all`, axiosConfig)
                .then((response) => {
                    setLottosAll(response.data)
                })
        } catch (error) {
        }
    }

    const selectStore = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStore(e.currentTarget!.value)
    }

    const selectLotto = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLotto(e.currentTarget!.value)
    }

    useEffect(() => {
        fetchRatesAll()
    }, [])



    return (
        <>
            <button onClick={openModal} className="mb-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">เพิ่มเรทการจ่าย</button>
            <div className="text-gray-900 bg-gray-200">
                <div className="p-4 flex">
                    <h1 className="text-3xl">
                        เรทการจ่ายทั้งหมด
                    </h1>
                </div>
                <div className="px-3 py-4 w-full">
                    <table className="text-md bg-white shadow-md rounded mb-4">
                        <thead>
                            <tr className="border-b">
                                <th className="text-center p-3 px-5">#</th>
                                <th className="text-center p-3 px-5">ชื่อร้าน</th>
                                <th className="text-center p-3 px-5">ชื่อหวย</th>
                                <th className="text-center p-3 px-5">เรทการจ่าย</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratesAll.map((rate, index) => (
                                <tr key={index} className="border-b hover:bg-orange-100 bg-gray-100 text-center">
                                    <td className="p-3" width={"5%"}>{index + 1}</td>
                                    {/* <td className="p-3" width={"25%"}>{rate.}</td>
                                    <td className="p-3" width={"25%"}>{user.username}</td>
                                    <td className="p-3" width={"25%"}>{user.role}</td>
                                    <td className="p-3" width={"20%"}>{user.store_id?.name ? user.store_id!.name : "-"}</td>
                                    <td className="p-3" width={"20%"}>{user.status}</td> */}
                                    <td className="p-3 flex justify-end"><button type="button" className="mr-3 text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">แก้ไข</button><button type="button" className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">ลบ</button></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>

            <Modal>
                <>
                    <section>
                        <div className="flex flex-col items-center justify-center mx-auto lg:py-0">
                            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex w-full justify-between">
                                    <h1 className="p-6 text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                        เพิ่มเรทการจ่าย
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
                                            <label htmlFor="store" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ร้าน</label>
                                            <select onChange={selectStore} ref={storeRef} name="store" id="store" className='w-full border rounded p-3'>
                                                <option >--เลือกร้าน--</option>
                                                {storesAll.map((store, index) => (
                                                    <option key={index} value={store.id}>{store.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">หวย</label>
                                            <select onChange={selectLotto} ref={lottoRef} name="lotto" id="lotto" className='w-full border rounded p-3'>
                                                <option >--เลือกหวย--</option>
                                                {lottosAll.map((lotto, index) => (
                                                    <option key={index} value={lotto.id}>{lotto.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ค่าคอมมิชชันเลขวิ่ง</p>
                                            <input ref={commissionOneTopRef} type="number" name="commission_one_top" id="commission_one_top" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="วิ่งบน" required />
                                            <input ref={commissionOneBottomRef} type="number" name="commission_one_bottom" id="commission_one_bottom" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="วิ่งล่าง" required />
                                        </div>
                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ค่าคอมมิชชันเลข 2 ตัว</p>
                                            <input ref={commissionTwoTopRef} type="number" name="commission_two_top" id="commission_two_top" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="2 ตัวบน" required />
                                            <input ref={commissionTwoBottomRef} type="number" name="commission_two_bottom" id="commission_two_bottom" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="2 ตัวล่าง" required />
                                        </div>
                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ค่าคอมมิชชันเลข 3 ตัว</p>
                                            <input ref={commissionThreeTopRef} type="number" name="commission_three_top" id="commission_three_top" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="3 ตัวบน" required />
                                            <input ref={commissionThreeBottomRef} type="number" name="commission_three_bottom" id="commission_three_bottom" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="3 ตัวโต๊ด" required />
                                        </div>

                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">อัตราจ่ายวิ่งบน</p>
                                            <input ref={oneTopRef} type="number" name="one_top" id="one_top" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อัตราจ่าย" required />
                                            <input ref={oneTopMinRef} type="number" name="one_top_min" id="one_top_min" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงขั้นต่ำ" required />
                                            <input ref={oneTopMaxRef} type="number" name="one_top_max" id="one_top_max" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงสูงสุด" required />
                                            <input ref={oneTopLimitRef} type="number" name="one_top_limit" id="one_top_limit" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ลิมิต" required />
                                        </div>
                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">อัตราจ่ายวิ่งล่าง</p>
                                            <input ref={oneBottomRef} type="number" name="one_bottom" id="one_bottom" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อัตราจ่าย" required />
                                            <input ref={oneBottomMinRef} type="number" name="one_bottom_min" id="one_bottom_min" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงขั้นต่ำ" required />
                                            <input ref={oneBottomMaxRef} type="number" name="one_bottom_max" id="one_bottom_max" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงสูงสุด" required />
                                            <input ref={oneBottomLimitRef} type="number" name="one_bottom_limit" id="one_bottom_limit" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ลิมิต" required />
                                        </div>
                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">อัตราจ่าย 2 ตัวบน</p>
                                            <input ref={twoTopRef} type="number" name="two_top" id="two_top" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อัตราจ่าย" required />
                                            <input ref={twoTopMinRef} type="number" name="two_top_min" id="two_top_min" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงขั้นต่ำ" required />
                                            <input ref={twoTopMaxRef} type="number" name="two_top_max" id="two_top_max" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงสูงสุด" required />
                                            <input ref={twoTopLimitRef} type="number" name="two_top_limit" id="two_top_limit" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ลิมิต" required />
                                        </div>
                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">อัตราจ่าย 2 ตัวล่าง</p>
                                            <input ref={twoBottomRef} type="number" name="two_bottom" id="two_bottom" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อัตราจ่าย" required />
                                            <input ref={twoBottomMinRef} type="number" name="two_bottom_min" id="two_bottom_min" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงขั้นต่ำ" required />
                                            <input ref={twoBottomMaxRef} type="number" name="two_bottom_max" id="two_bottom_max" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงสูงสุด" required />
                                            <input ref={twoBottomLimitRef} type="number" name="two_bottom_limit" id="two_bottom_limit" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ลิมิต" required />
                                        </div>
                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">อัตราจ่าย 3 ตัวบน</p>
                                            <input ref={threeTopRef} type="number" name="three_top" id="three_top" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อัตราจ่าย" required />
                                            <input ref={threeTopMinRef} type="number" name="three_top_min" id="three_top_min" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงขั้นต่ำ" required />
                                            <input ref={threeTopMaxRef} type="number" name="three_top_max" id="three_top_max" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงสูงสุด" required />
                                            <input ref={threeTopLimitRef} type="number" name="three_top_limit" id="three_top_limit" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ลิมิต" required />
                                        </div>
                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">อัตราจ่าย 3 ตัวโต๊ด</p>
                                            <input ref={threeBottomRef} type="number" name="three_bottom" id="three_bottom" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="อัตราจ่าย" required />
                                            <input ref={threeBottomMinRef} type="number" name="three_bottom_min" id="three_bottom_min" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงขั้นต่ำ" required />
                                            <input ref={threeBottomMaxRef} type="number" name="three_bottom_max" id="three_bottom_max" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="แทงสูงสุด" required />
                                            <input ref={threeBottomLimitRef} type="number" name="three_bottom_limit" id="three_bottom_limit" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ลิมิต" required />
                                        </div>
                                        <button type="submit" onClick={addRate} className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">เพิ่มเรทการจ่าย</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            </Modal>
        </>
    )
}

export default ManageRate