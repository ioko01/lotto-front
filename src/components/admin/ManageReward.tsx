import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { axiosConfig } from '../../utils/headers'
import { ICheckRewardDoc, ILottoDoc } from '../../models/Id'
import { ICheckReward } from '../../models/CheckReward'
import { Modal } from '../modal/Modal'
import { useDispatch } from 'react-redux'
import { stateModal } from '../../redux/features/modal/modalSlice'

type Props = {}

const ManageReward = (props: Props) => {

    const [rewardAll, setRewardAll] = useState<ICheckReward[]>([])
    const [checkReward, setCheckReward] = useState<ICheckReward>();
    const twoDigitRef = useRef<HTMLInputElement>(null);
    const threeDigitRef = useRef<HTMLInputElement>(null);
    const [two, setTwo] = useState('');
    const [three, setThree] = useState('');

    const dispatch = useDispatch();


    const fetchLottosAndRewardAll = async () => {
        try {
            const fetchLottos = await axios.get(`${import.meta.env.VITE_OPS_URL}/get/lotto/all`, axiosConfig)
            if (fetchLottos) {
                const lottos = fetchLottos.data as ILottoDoc[]
                const fetchRewards = await axios.get(`${import.meta.env.VITE_OPS_URL}/get/reward/all`, axiosConfig)
                if (fetchRewards) {
                    const rewards = fetchRewards.data as ICheckRewardDoc[]
                    lottos.map(lotto => {
                        setRewardAll(prevState => [...prevState, { top: "", bottom: "", lotto_id: lotto, times: "" }])
                        rewards.map(reward => {
                            if (reward.lotto_id.id == lotto.id) {
                                setRewardAll(prevState => [...prevState, reward])
                            }
                        })
                    })


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
                                    <td className="p-3">{reward.times}</td>
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