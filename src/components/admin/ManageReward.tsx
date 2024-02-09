import axios from 'axios'
import { useEffect, useState } from 'react'
import { axiosConfig } from '../../utils/headers'
import { ICheckRewardDoc, ILottoDoc } from '../../models/Id'

type Props = {}

const ManageReward = (props: Props) => {

    const [lottosAll, setLottosAll] = useState<ILottoDoc[]>([])


    const fetchLottosAndRewardAll = () => {
        try {
            axios.get(`${import.meta.env.VITE_OPS_URL}/get/lotto/all`, axiosConfig)
                .then((response) => {
                    const data = response.data as ILottoDoc
                    setLottosAll([data])

                    axios.get(`${import.meta.env.VITE_OPS_URL}/get/reward/all`, axiosConfig)
                        .then((response) => {
                            const data = response.data as ICheckRewardDoc
                            console.log(data)
                        })
                })
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
                                <th className="text-center p-3 px-5">ผล</th>
                                <th className="text-center p-3 px-5">ใส่ผล</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lottosAll.map((lotto, index) => (
                                <tr key={index} className="border-b hover:bg-orange-100 bg-gray-100 text-center">
                                    <td className="p-3" width={"5%"}>{index + 1}</td>
                                    <td className="p-3" width={"25%"}>{lotto.name}</td>
                                    <td className="p-3" width={"25%"}>{lotto.name}</td>


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