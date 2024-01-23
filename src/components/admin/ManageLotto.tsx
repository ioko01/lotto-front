import React, { useEffect, useRef, useState } from 'react'
import { stateModal } from '../../redux/features/modal/modalSlice'
import { useDispatch } from 'react-redux'
import { Modal } from '../modal/Modal'
import { io } from '../../utils/socket-io'
import { useAppSelector } from '../../redux/hooks'
import axios, { AxiosRequestConfig } from 'axios'
import { axiosConfig } from '../../utils/headers'
import { IStore } from '../../models/Store'
import { IUser, TUserRoleEnum } from '../../models/User'
import { ILotto, TLottoDate, TLottoDateEnum, TLottoStatusEnum } from '../../models/Lotto'
import { getToken } from '../../utils/token'

type Props = {}

const ManageLotto = (props: Props) => {
    interface IUserDoc extends IUser {
        id: string
    }
    const dispatch = useDispatch()
    const [storesAll, setStoresAll] = useState<IStore[]>([])
    const [date, setDate] = useState<TLottoDate>(TLottoDateEnum.SELECT_DATE)
    const [currentFile, setCurrentFile] = useState<File>()
    const openHoursRef = useRef<HTMLSelectElement>(null);
    const openMinutesRef = useRef<HTMLSelectElement>(null);
    const closeHoursRef = useRef<HTMLSelectElement>(null);
    const closeMinutesRef = useRef<HTMLSelectElement>(null);
    const reportHoursRef = useRef<HTMLSelectElement>(null);
    const reportMinutesRef = useRef<HTMLSelectElement>(null);
    const thaiOpenRef = useRef<HTMLSelectElement>(null);
    const dateRef = useRef<HTMLSelectElement>(null);
    const lottoNameRef = useRef<HTMLInputElement>(null);
    const isLoading = document.getElementById("loading")

    const [daysValue, setDaysValue] = useState<string[]>([]);
    const [lottosAll, setLottosAll] = useState<ILotto[]>([]);

    const fetchLotto = () => {
        axios.get(`${import.meta.env.VITE_OPS_URL}/get/lotto/all`, axiosConfig)
            .then((res) => {
                setLottosAll(res.data)
            })
            .catch(() => {

            })
    }

    const openModal = () => {
        dispatch(stateModal({ show: true, openModal: "CONFIG", confirm: true }))
    }

    const changeDate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDate(e.target.value as TLottoDate)
        setDaysValue([])
    }

    const hours = []
    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            hours.push(`0${i}`)
        } else {
            hours.push(i)
        }
    }
    const minutes = []
    for (let i = 0; i < 60; i++) {
        if (i < 10) {
            minutes.push(`0${i}`)
        } else {
            minutes.push(i)
        }
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        const selectedFiles = files as FileList;
        setCurrentFile(selectedFiles?.[0]);

    };

    const selectDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = e.target.value

        if (daysValue.includes(selectedValue)) {
            const newIds = daysValue.filter((day) => day !== selectedValue);
            setDaysValue(newIds);
        } else {
            const newIds = [...daysValue];
            newIds.push(selectedValue);
            setDaysValue(newIds);
        }
    };

    const uploadFile = () => {
        const formData = new FormData();
        formData.append("File", currentFile!);
        axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'

        return axios.post(`${import.meta.env.VITE_OPS_URL}/upload/file`, formData, axiosConfig)
    }

    const addLotto = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        isLoading!.removeAttribute("style")
        isLoading!.style.position = "fixed"
        uploadFile()

        const lotto: ILotto = {
            name: lottoNameRef.current!.value,
            date: daysValue,
            open: `${openHoursRef.current?.value}:${openMinutesRef.current?.value}`,
            close: `${closeHoursRef.current?.value}:${closeMinutesRef.current?.value}`,
            report: `${reportHoursRef.current?.value}:${reportMinutesRef.current?.value}`,
            status: TLottoStatusEnum.OPEN,
            date_type: date,
            img_flag: currentFile!.name
        }

        axios.post(`${import.meta.env.VITE_OPS_URL}/add/lotto`, lotto, axiosConfig).then((res) => {
            fetchLotto()
            isLoading!.style.display = "none"
            dispatch(stateModal({ show: false, openModal: "CONFIG", confirm: true }))
        })



    };

    useEffect(() => {
        fetchLotto()
    }, [dateRef])

    return (
        <>
            <button onClick={openModal} className="mb-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">เพิ่มหวย</button>
            <div className="text-gray-900 bg-gray-200">
                <div className="p-4 flex">
                    <h1 className="text-3xl">
                        หวยทั้งหมด
                    </h1>
                </div>
                <div className="px-3 py-4 w-full">
                    <table className="text-md bg-white shadow-md rounded mb-4">
                        <thead>
                            <tr className="border-b">
                                <th className="text-center p-3 px-5">#</th>
                                <th className="text-center p-3 px-5">ชื่อหวย</th>
                                <th className="text-center p-3 px-5">เปิด</th>
                                <th className="text-center p-3 px-5">ปิด</th>
                                <th className="text-center p-3 px-5">การออกผล</th>
                                <th className="text-center p-3 px-5">สถานะ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lottosAll.map((lotto, index) => (
                                <tr key={index} className="border-b hover:bg-orange-100 bg-gray-100 text-center">
                                    <td className="p-3" width={"5%"}>{index + 1}</td>
                                    <td className="p-3" width={"25%"}>{lotto.name}</td>
                                    <td className="p-3" width={"25%"}>{lotto.open}</td>
                                    <td className="p-3" width={"25%"}>{lotto.close}</td>
                                    <td className="p-3" width={"25%"}>{lotto.date_type === "SELECT_DATE" ? lotto.date!.length === 7 ? "ออกผลทุกวัน" : lotto.date?.toString() : "ออกวันหวยไทย"}</td>
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
                                    เพิ่มหวย
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
                                        <label htmlFor="lotto_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ธง</label>
                                        <input type="file" onChange={onFileChange} accept='image/*' />
                                    </div>
                                    <div>
                                        <label htmlFor="lotto_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อหวย</label>
                                        <input ref={lottoNameRef} type="text" name="lotto_name" id="lotto_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ชื่อหวย" required />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">วันเปิดรับ</label>
                                        <select onChange={changeDate} name="date" id="date" className='w-full border rounded p-3 mb-3'>
                                            <option value={TLottoDateEnum.SELECT_DATE} defaultChecked>เลือกวัน</option>
                                            <option value={TLottoDateEnum.THAI}>หวยไทย</option>
                                        </select>
                                        {
                                            date === TLottoDateEnum.SELECT_DATE ?
                                                <>
                                                    <div className="flex items-center">
                                                        <input onChange={selectDate} id='sunday' type="checkbox" value="sunday" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                        <label htmlFor="sunday" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">อาทิตย์</label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input onChange={selectDate} id='monday' type="checkbox" value="monday" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                        <label htmlFor="monday" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">จันทร์</label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input onChange={selectDate} id='tuesday' type="checkbox" value="tuesday" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                        <label htmlFor="tuesday" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">อังคาร</label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input onChange={selectDate} id='wednesday' type="checkbox" value="wednesday" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                        <label htmlFor="wednesday" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">พุธ</label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input onChange={selectDate} id='thursday' type="checkbox" value="thursday" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                        <label htmlFor="thursday" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">พฤหัส</label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input onChange={selectDate} id='friday' type="checkbox" value="friday" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                        <label htmlFor="friday" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ศุกร์</label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input onChange={selectDate} id='saturday' type="checkbox" value="saturday" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                        <label htmlFor="saturday" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">เสาร์</label>
                                                    </div>
                                                </> :
                                                <>
                                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เปิดรับก่อนหวยออก</label>
                                                    <div className='flex gap-3'>
                                                        <div>
                                                            <label htmlFor="day" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">วัน</label>
                                                            <select ref={thaiOpenRef} name="day" id="day" className='w-full border rounded p-3'>
                                                                <option value={1}>{1}</option>
                                                                <option value={2}>{2}</option>
                                                                <option value={3}>{3}</option>
                                                                <option value={4}>{4}</option>
                                                                <option value={5}>{5}</option>
                                                                <option value={6}>{6}</option>
                                                                <option value={7}>{7}</option>
                                                                <option value={8}>{8}</option>
                                                                <option value={9}>{9}</option>
                                                                <option value={10}>{10}</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </>
                                        }


                                    </div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เวลาเปิด</label>
                                    <div className='flex gap-3'>
                                        <div>
                                            <label htmlFor="open_hours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชั่วโมง</label>
                                            <select ref={openHoursRef} name="open_hours" id="open_hours" className='w-full border rounded p-3'>
                                                {hours.map((hour) => (
                                                    <option key={hour} value={hour}>{hour}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="open_minute" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">นาที</label>
                                            <select ref={openMinutesRef} name="open_minute" id="open_minute" className='w-full border rounded p-3'>
                                                {minutes.map((minute) => (
                                                    <option key={minute} value={minute}>{minute}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เวลาปิด</label>
                                    <div className='flex gap-3'>
                                        <div>
                                            <label htmlFor="close_hours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชั่วโมง</label>
                                            <select ref={closeHoursRef} name="close_hours" id="close_hours" className='w-full border rounded p-3'>
                                                {hours.map((hour) => (
                                                    <option key={hour} value={hour}>{hour}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="close_minute" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">นาที</label>
                                            <select ref={closeMinutesRef} name="close_minute" id="close_minute" className='w-full border rounded p-3'>
                                                {minutes.map((minute) => (
                                                    <option key={minute} value={minute}>{minute}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>


                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เวลาผลออก</label>
                                    <div className='flex gap-3'>
                                        <div>
                                            <label htmlFor="report_hours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชั่วโมง</label>
                                            <select ref={reportHoursRef} name="report_hours" id="report_hours" className='w-full border rounded p-3'>
                                                {hours.map((hour) => (
                                                    <option key={hour} value={hour}>{hour}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="report_minute" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">นาที</label>
                                            <select ref={reportMinutesRef} name="report_minute" id="report_minute" className='w-full border rounded p-3'>
                                                {minutes.map((minute) => (
                                                    <option key={minute} value={minute}>{minute}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={!currentFile} onClick={addLotto} className={(!currentFile ? 'bg-gray-300 text-gray-500 ' : 'bg-blue-600 hover:bg-blue-700 ') + "w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"}>เพิ่มหวย</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </Modal>
        </>
    )
}

export default ManageLotto