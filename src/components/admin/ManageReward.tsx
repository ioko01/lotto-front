import axios from 'axios'
import { useEffect, useState } from 'react'
import { axiosConfig } from '../../utils/headers'
import { ICheckRewardDoc, ILottoDoc } from '../../models/Id'
import { ICheckReward } from '../../models/CheckReward'

type Props = {}

const ManageReward = (props: Props) => {

    const [rewardAll, setRewardAll] = useState<ICheckReward[]>([])


    const fetchLottosAndRewardAll = async () => {
        try {
            const fetchLottos = await axios.get(`${import.meta.env.VITE_OPS_URL}/get/lotto/all`, axiosConfig)
            if (fetchLottos) {
                const lottos = fetchLottos.data as ILottoDoc[]
                const fetchRewards = await axios.get(`${import.meta.env.VITE_OPS_URL}/get/reward/all`, axiosConfig)
                if (fetchRewards) {
                    const rewards = fetchRewards.data as ICheckRewardDoc[]
                    lottos.map(lotto => {
                        setRewardAll([...rewardAll, { reward: "", lotto_id: lotto, times: "" }])
                        rewards.map(reward => {
                            if (reward.lotto_id.id == lotto.id) {
                                setRewardAll([...rewardAll, reward])
                            }
                        })
                    })


                }
            }

            console.log(rewardAll);
        } catch (error) {
        }
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
                                    <td className="p-3">{reward.reward}</td>
                                    <td className="p-3">ใส่ผล</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ManageReward