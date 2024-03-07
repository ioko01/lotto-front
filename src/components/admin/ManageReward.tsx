import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { axiosConfig } from '../../utils/headers'
import { ICheckRewardDoc, ILottoDoc } from '../../models/Id'
import { ICheckReward } from '../../models/CheckReward'
import { Modal } from '../modal/Modal'
import { useDispatch } from 'react-redux'
import { stateModal } from '../../redux/features/modal/modalSlice'
import Datepicker from 'react-tailwindcss-datepicker'
import { TDate, TypeDate } from '../../models/Main'
import moment from 'moment'

type Props = {}

const ManageReward = (props: Props) => {

    const [rewardAll, setRewardAll] = useState<ICheckReward[]>([])
    const [checkReward, setCheckReward] = useState<ICheckReward>();
    const twoDigitRef = useRef<HTMLInputElement>(null);
    const threeDigitRef = useRef<HTMLInputElement>(null);
    const [two, setTwo] = useState('');
    const [three, setThree] = useState('');

    const [disabledDatepicker, setDisabledDatepicker] = useState<boolean>(true)
    const [disabledMonth, setDisabledMonth] = useState<boolean>(true)

    const [isDate, setDate] = useState<TypeDate>({
        startDate: new Date(),
        endDate: new Date()
    });


    const handleDateChange = (newDate: TypeDate) => {
        setDate(newDate)
    }

    const toggleDisabled = (disabledMonth: boolean, disabledDatePicker: boolean) => {
        setDisabledMonth(disabledMonth)
        setDisabledDatepicker(disabledDatePicker)
    }

    const selectDateType = (date: TDate, month: number = 0) => {
        const thisDateStart = new Date()
        const thisDateEnd = new Date()
        let start = new Date()
        let end = new Date()

        if (date == "TODAY") {
            start = thisDateStart
            end = thisDateEnd
        }

        if (date == "YESTERDAY") {
            thisDateStart.setDate(thisDateStart.getDate() - 1).toString()
            thisDateEnd.setDate(thisDateEnd.getDate() - 1).toString()

            start = thisDateStart
            end = thisDateEnd
        }

        if (date == "THIS_WEEK") {
            thisDateStart.setDate(thisDateStart.getDate() - thisDateStart.getDay() + 1).toString()
            start = thisDateStart

            end = thisDateEnd
        }

        if (date == "LAST_WEEK") {
            thisDateStart.setDate(thisDateStart.getDate() - thisDateStart.getDay() - 7).toString()
            start = thisDateStart

            thisDateEnd.setDate(thisDateEnd.getDate() - thisDateEnd.getDay()).toString()
            end = thisDateEnd
        }

        if (date == "MONTH") {
            thisDateStart.setDate(1).toString()
            thisDateStart.setMonth(month - 1)
            start = thisDateStart

            thisDateEnd.setMonth(month, 0)
            end = thisDateEnd
        }

        if (date == "SELECT_DATE") {
            start = new Date(isDate!.startDate!)
            end = new Date(isDate!.endDate!)
        }

        setDate({
            startDate: start,
            endDate: end
        })
    }

    const dispatch = useDispatch();


    const fetchLottosAndRewardAll = async () => {
        try {
            const fetchLottos = await axios.get(`${import.meta.env.VITE_OPS_URL}/get/lotto/all`, axiosConfig)
            if (fetchLottos) {
                const start = new Date(isDate!.startDate!)
                const end = new Date(isDate!.endDate!)

                const ds = `${start.getDate()}-${start.getMonth() + 1}-${start.getFullYear()}`
                const de = `${end.getDate()}-${end.getMonth() + 1}-${end.getFullYear()}`

                const lottos = fetchLottos.data as ILottoDoc[]
                const fetchRewards = await axios.get(`${import.meta.env.VITE_OPS_URL}/get/reward/lotto/${ds}/${de}`, axiosConfig)
                if (fetchRewards) {
                    const rewards = fetchRewards.data as ICheckRewardDoc[]
                    let getRewardAll: ICheckReward[] = []
                    lottos.map((lotto, index) => {
                        getRewardAll.push({ top: "", bottom: "", lotto_id: lotto, times: new Date() })
                        rewards.map(reward => {
                            console.log(reward.lotto_id.id, lotto.id);
                            if (reward.lotto_id.id == lotto.id) {
                                getRewardAll[index] = reward
                            }
                        })
                    })
                    setRewardAll(getRewardAll)
                }
                
            }
        } catch (error) {
        }
    }

    const addCheckReward = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, reward: ICheckReward) => {
        try {
            e.preventDefault()
            if (twoDigitRef.current!.value
                && threeDigitRef.current!.value) {
                reward.top = threeDigitRef.current!.value
                reward.bottom = twoDigitRef.current!.value
                reward.times = new Date(isDate!.startDate!)
                const fetchCheckReward = await axios.post(`${import.meta.env.VITE_OPS_URL}/add/reward`, reward, axiosConfig)
                if (fetchCheckReward.status == 200) {


                } else {

                }
            } else {

            }
        } catch (error) {
        }
    }

    const openCheckRewardModal = (reward: ICheckReward) => {
        dispatch(stateModal({ show: true, openModal: "CONFIG", confirm: true }))
        setCheckReward(reward);
    }

    useEffect(() => {
        fetchLottosAndRewardAll()
    }, [])

    return (
        <>
            <strong>ตัวเลือกการค้นหา</strong>
            <div className="flex flex-row mt-3">
                <div className="flex items-center mr-10">
                    <input onChange={() => { toggleDisabled(true, true); selectDateType("TODAY"); }} defaultChecked id="today" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="today" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">วันนี้</label>
                </div>
                <div className="flex items-center mr-10">
                    <input onChange={() => { toggleDisabled(true, true); selectDateType("YESTERDAY"); }} id="yesterday" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="yesterday" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">เมื่อวาน</label>
                </div>
            </div>

            <div className="flex flex-row mt-3 whitespace-nowrap w-full">
                <div style={{ width: "90px" }} className="flex items-center">
                    <input onChange={() => { toggleDisabled(true, false); selectDateType("SELECT_DATE"); }} id="custom_date" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="custom_date" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">เลือกวันที่</label>
                </div>
                <div style={{ width: "320px" }} className="border rounded-lg">
                    <Datepicker
                        primaryColor="indigo"
                        i18n="th"
                        configs={{
                            footer: {
                                apply: "ยืนยัน",
                                cancel: "ยกเลิก"
                            }
                        }}
                        placeholder="วัน/เดือน/ปี"
                        value={isDate}
                        useRange={false}
                        asSingle={true}
                        inputClassName={"relative text-center transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-indigo-500 focus:ring-indigo-500/20"}
                        displayFormat={"DD/MM/YYYY"}
                        onChange={handleDateChange}
                        readOnly={true}
                        maxDate={new Date(Date.now())}
                        disabled={disabledDatepicker}
                    />
                </div>
            </div>

            <div className="flex flex-row mt-3">
                <button onClick={fetchLottosAndRewardAll} className="inline-flex font-bold text-xs bg-blue-800 hover:bg-blue-700 text-white font-light p-2 px-4 rounded-md shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    ค้นหา</button>
            </div>
            <br />
            <div className="text-gray-900 bg-gray-200">
                <div className="p-4 flex">
                    <h1 className="text-3xl">
                        ตรวจรางวัล
                    </h1>
                </div>
                <div className="px-3 py-4 w-full">
                    <table className="text-md bg-white shadow-md rounded mb-4 w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-center p-3 px-5">#</th>
                                <th className="text-center p-3 px-5">ชื่อหวย</th>
                                <th className="text-center p-3 px-5">งวดที่</th>
                                <th className="text-center p-3 px-5">ผล</th>
                                <th className="text-center p-3 px-5">API</th>
                                <th className="text-center p-3 px-5">ใส่ผล</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rewardAll.map((reward, index) => (
                                <tr key={index} className="border-b hover:bg-orange-100 bg-gray-100 text-center">
                                    <td className="p-3" width={"10%"}>{index + 1}</td>
                                    <td className="p-3">{reward.lotto_id.name}</td>
                                    <td className="p-3">{moment(new Date(Object(reward.times)['seconds'] * 1000 + Object(reward.times)['nanoseconds'] / 1000)).format("DD-MM-YYYY") != "Invalid date" ? moment(new Date(Object(reward.times)['seconds'] * 1000 + Object(reward.times)['nanoseconds'] / 1000)).format("DD-MM-YYYY") : moment(isDate!.startDate!).format("DD-MM-YYYY")}</td>
                                    <td className="p-3">{(reward.top || reward.bottom) ? `${reward.top}/${reward.bottom}` : "รอผล"}</td>
                                    <td className="p-3">{reward.lotto_id.api ?? "-"}</td>
                                    <td className="p-3"><button className='btn btn-primary' onClick={() => openCheckRewardModal(reward)}>{(reward.top && reward.bottom) ? "แก้ไขผล" : "ใส่ผล"}</button></td>
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
                                        ใส่ผล
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
                                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">หวย {checkReward?.lotto_id.name}</label>
                                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">งวดที่ {moment(isDate!.startDate!).format("DD-MM-YYYY")}</label>
                                        </div>

                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลข 3 ตัว</p>
                                            <input value={three} maxLength={3} onChange={(e) => setThree(e.currentTarget.value.replace(/\D/g, ''))} pattern="[0-9]{1,3}" ref={threeDigitRef} type="text" name="three_digit" id="three_digit" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="เลข 3 ตัว" required />

                                        </div>
                                        <div>
                                            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เลข 2 ตัว</p>
                                            <input value={two} maxLength={2} onChange={(e) => setTwo(e.currentTarget.value.replace(/\D/g, ''))} pattern="[0-9]{1,2}" ref={twoDigitRef} type="text" name="commission_two_top" id="commission_two_top" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="เลข 2 ตัว" required />
                                        </div>
                                        <button type="submit" onClick={(e) => addCheckReward(e, checkReward!)} className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">ยืนยัน</button>
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

export default ManageReward