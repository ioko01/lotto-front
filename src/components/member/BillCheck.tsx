import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addBill } from "../../redux/features/bill/billSlice";
import { TWO, THREE, ONE, TDigit } from "../../models/Type";
import { addNotePrice } from "../../redux/features/bill/notePriceSlice";
import BillHelperClass, { IBillDoc } from "../../helpers/Bill";
import axios from "axios";
import { IBill } from "../../models/Bill";
import { AuthContext } from "../../context/AuthContextProvider";
import { axiosConfig } from "../../utils/headers";
import { IRate } from "../../models/Rate";
import { ILottoDoc } from "./Home";
import { ILotto, TLottoStatusEnum } from "../../models/Lotto";
import { ICommission } from "../../models/Commission";
import { countdown } from "../../utils/countdown";
import { Time } from "../../models/Time";

interface Props {
    digit: string
    digit_type: TDigit
    index: number
    rate: string | string[] | undefined
    commission: number
}

function TableBill({ digit, digit_type, index, rate, commission }: Props) {

    let type = ""
    if (ONE.includes(digit_type) && index === 1) {
        type = "วิ่งบน"
    } else if (ONE.includes(digit_type) && index === 2) {
        type = "วิ่งล่าง"
    } else if (TWO.includes(digit_type) && index === 1) {
        type = "2 ตัวบน"
    } else if (TWO.includes(digit_type) && index === 2) {
        type = "2 ตัวล่าง"
    } else if (THREE.includes(digit_type) && index === 1) {
        type = "3 ตัวบน"
    } else if (THREE.includes(digit_type) && index === 2) {
        type = "3 ตัวโต๊ด"
    }

    return (
        <tr>
            <td className="border px-1 font-light">{type}</td>
            <td className="border px-1 font-light">{digit.split(":")[0]}</td>
            <td className="border px-1 font-light">{digit.split(":")[index]}</td>
            <td className="border px-1 font-light">{rate!}</td>
            <td className="border px-1 font-light">{commission}</td>
            <td className="border px-1 font-light text-center">
                {/* <button className="text-xs text-red-600 hover:text-red-400 font-bold p-2 rounded shadow mx-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg></button> */}
            </td>
        </tr>
    )
}

export function BillCheck() {
    const dispatch = useAppDispatch()
    const bills = useAppSelector(state => state.bill)
    const notePrice = useAppSelector(state => state.notePrice)
    const navigate = useNavigate();
    const [isBills, setIsBills] = useState<IBillDoc[]>([])
    const [digitOne, setDigitOne] = useState<string[]>([])
    const [digitTwo, setDigitTwo] = useState<string[]>([])
    const [digitThree, setDigiThree] = useState<string[]>([])
    const { isUser } = useContext(AuthContext)
    const isLoading = document.getElementById("loading")
    const location = useLocation()
    const [rate, setRate] = useState<IRate>()
    const [lotto, setLotto] = useState<ILottoDoc | null>(null)
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
    const commissions = useAppSelector(state => state.commission)

    let newTime: Time;
    const [time, setTime] = useState<Time>()
    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dateNow = new Date();


    const pagePrev = () => {
        dispatch(addBill(bills))
        dispatch(addNotePrice(notePrice))
        navigate(-1)
    }

    // const fetchBills = async () => {
    //     const getBills = await axios.get<IBillDoc[]>(import.meta.env.VITE_OPS_URL + "/getbill")
    //     setIsBills(getBills.data)
    // }

    const fetchRate = async () => {
        const id = location.pathname.split("/")[3]
        const res = await axios.get(import.meta.env.VITE_OPS_URL + `/get/rate/id/${id}`, axiosConfig)
        if (res && res.status == 200) {
            setRate(res.data)
        }
    }

    const fetchLotto = async () => {
        const id = location.pathname.split("/")[3]
        const fetchLotto = await axios.get(import.meta.env.VITE_OPS_URL + `/get/lotto/id/${id}`, axiosConfig)
        const data = fetchLotto.data as ILottoDoc
        if (fetchLotto && fetchLotto.status == 200) {

            if (data.date!.includes(day[dateNow.getDay()])) {
                setLotto(data)
                timer(data.id, data.open, data.close, data.status as TLottoStatusEnum, 1)

                await fetchImage(data)
                timer(data.id, data.open, data.close, data.status as TLottoStatusEnum, 1)
            } else {
                setLotto(null)
                navigate("/")
            }

        }
    }


    // console.log(isBills)
    // const BILL: IBill = {
    //     store: {
    //         name: "ร้านมั่งมี",
    //         img_logo: "logo.jpg",
    //         user_create_id: "1",
    //         created_at: new Date(),
    //         updated_at: new Date()
    //     },
    //     lotto: {
    //         name: "ดาวน์โจนส์ VIP",
    //         img_flag: "jones.jpg",
    //         open: new Date(),
    //         close: new Date(),
    //         report: new Date(),
    //         status: "OPEN",
    //         created_at: new Date(),
    //         updated_at: new Date(),
    //         user_create_id: "1"
    //     },
    //     rate: {
    //         store: {
    //             name: "ร้านมั่งมี",
    //             img_logo: "logo.jpg",
    //             user_create_id: "1",
    //             created_at: new Date(),
    //             updated_at: new Date()
    //         },
    //         lotto: {
    //             name: "ดาวน์โจนส์ VIP",
    //             img_flag: "jones.jpg",
    //             open: new Date(),
    //             close: new Date(),
    //             report: new Date(),
    //             status: "OPEN",
    //             created_at: new Date(),
    //             updated_at: new Date(),
    //             user_create_id: "1"
    //         },
    //         one_digits: {
    //             top: "3",
    //             bottom: "4"
    //         },
    //         two_digits: {
    //             top: "95",
    //             bottom: "95"
    //         },
    //         three_digits: {
    //             top: "800",
    //             toad: "125"
    //         },
    //         bet_one_digits: {
    //             top: "1:10000:100000",
    //             bottom: "1:10000:100000"
    //         },
    //         bet_two_digits: {
    //             top: "1:10000:100000",
    //             bottom: "1:10000:100000"
    //         },
    //         bet_three_digits: {
    //             top: "1:10000:100000",
    //             bottom: "1:10000:100000"
    //         },
    //         created_at: new Date(),
    //         updated_at: new Date(),
    //         user_create_id: "1"
    //     },
    //     one_digits: digitOne,
    //     two_digits: digitTwo,
    //     three_digits: digitThree,
    //     times: "12-01-2566",
    //     note: "asd",
    //     status: "WAIT",
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //     user_create_id: "1"

    // }

    const addBillToDatabase = async () => {
        // await axios.post(import.meta.env.VITE_OPS_URL + "/addbill", BILL).then(res => {
        //     console.log(res)
        //     setIsLoading(true)
        // }).catch(error => {
        //     console.log(error)
        // }).finally(() => {
        //     setIsLoading(false)
        // })
    }

    const fetchImage = async (lotto: ILotto) => {
        const res = await axios.get(`${import.meta.env.VITE_OPS_URL}/get/file/${lotto.img_flag}`, {
            responseType: 'blob',
            withCredentials: axiosConfig.withCredentials,
            timeout: axiosConfig.timeout,
            headers: axiosConfig.headers
        })
        if (res && res.status == 200) {
            const reader = new FileReader();
            reader.readAsDataURL(res.data);

            reader.onloadend = function () {
                const base64data = reader.result;
                setImage(base64data);
            };
        }
    }

    let count = 0
    const timer = (id: string, open: string, close: string, status: TLottoStatusEnum, amount: number) => {

        const interval = setInterval(() => {
            const cd = countdown(open, close)

            // if (cd.days < 0) {
            //     clearInterval(interval)
            // }

            const days = status == TLottoStatusEnum.OPEN ? cd.days < 10 ? `0${cd.days.toString()}` : cd.days.toString() : "00"
            const hours = status == TLottoStatusEnum.OPEN ? cd.hours < 10 ? `0${cd.hours.toString()}` : cd.hours.toString() : "00"
            const minutes = status == TLottoStatusEnum.OPEN ? cd.minutes < 10 ? `0${cd.minutes.toString()}` : cd.minutes.toString() : "00"
            const seconds = status == TLottoStatusEnum.OPEN ? cd.seconds < 10 ? `0${cd.seconds.toString()}` : cd.seconds.toString() : "00"

            newTime = {
                id: id,
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
            setTime(newTime)
            count++
        }, 1000)

    }

    useEffect(() => {
        isLoading!.removeAttribute("style")
        isLoading!.style.position = "fixed"
        if (bills.length === 0) {
            navigate('/', { replace: true });
        }


        bills.map(digit => {
            ONE.includes(digit.digit_type) && setDigitOne(digit.digit)
            TWO.includes(digit.digit_type) && setDigitTwo(digit.digit)
            THREE.includes(digit.digit_type) && setDigiThree(digit.digit)
        })


        fetchLotto()
        fetchRate()

    }, [bills, notePrice])

    const totalPrice = notePrice.price.reduce((price, current) => {
        return price + current
    }, 0)

    return (
        rate! ? <div id="bill_check" className="flex flex-col">
            <div className="basis-full w-full p-2">
                <div id="bill_time" className="flex flex-col w-full mb-3 p-2 text-red-500">
                    เหลือเวลา {time?.hours ?? "00"}:{time?.minutes ?? "00"}:{time?.seconds ?? "00"}
                </div>
            </div>
            <div className="flex flex-row">
                <div className="basis-3/6 w-full p-2">
                    <div id="bill_content" style={{ minWidth: "420px", maxWidth: "568px" }} className="flex flex-col items-center">

                        <div id="bill_header" className="flex flex-col items-center rounded-lg border border-green-400 bg-green-100 w-full mb-3 p-2">
                            <div className="flex justify-between w-full p-2">
                                <span>{lotto?.name}</span>
                                <span>2022-12-65</span>
                            </div>
                            <div className="flex justify-between w-full p-2">
                                <span>อัตราจ่าย</span>
                                <span>{`${rate?.two_digits.top}`}</span>
                                <span>ดูรายละเอียด</span>
                                <span><img width={60} src={`${image}`} alt="flag" className="object-cover" /></span>
                            </div>
                        </div>

                        <div id="bill_body" className="flex flex-col items-center w-full mb-3 p-2">
                            <table className="w-full">
                                <caption className="text-left text-lg">รายการแทง</caption>
                                <thead className="bg-blue-800 text-white">
                                    <tr>
                                        <th>ประเภท</th>
                                        <th>หมายเลข</th>
                                        <th>ยอดเดิมพัน</th>
                                        <th>เรทจ่าย</th>
                                        <th>ส่วนลด</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bills.map((bill) => (
                                        ONE.includes(bill.digit_type) ?
                                            bill.digit.map((digit, index) =>
                                                <React.Fragment key={"one" + index}>
                                                    {digit.split(":")[1] != "0" && <TableBill digit={digit} digit_type={bill.digit_type} index={1} rate={rate! && String(rate!.one_digits.top!)} commission={(parseFloat(digit.split(":")[1]) / 100) * parseFloat(commissions.one_digits.top!.toString())} />}
                                                    {digit.split(":")[2] != "0" && <TableBill digit={digit} digit_type={bill.digit_type} index={2} rate={rate! && String(rate!.one_digits.bottom!)} commission={(parseFloat(digit.split(":")[2]) / 100) * parseFloat(commissions.one_digits.bottom!.toString())} />}
                                                </React.Fragment>
                                            )
                                            : TWO.includes(bill.digit_type) ?
                                                bill.digit.map((digit, index) =>
                                                    <React.Fragment key={"two" + index}>
                                                        {digit.split(":")[1] != "0" && <TableBill digit={digit} digit_type={bill.digit_type} index={1} rate={rate! && String(rate!.two_digits.top!)} commission={(parseFloat(digit.split(":")[1]) / 100) * parseFloat(commissions.two_digits.top!.toString())} />}
                                                        {digit.split(":")[2] != "0" && <TableBill digit={digit} digit_type={bill.digit_type} index={2} rate={rate! && String(rate!.two_digits.bottom!)} commission={(parseFloat(digit.split(":")[2]) / 100) * parseFloat(commissions.two_digits.bottom!.toString())} />}
                                                    </React.Fragment>
                                                )
                                                : THREE.includes(bill.digit_type) &&
                                                bill.digit.map((digit, index) =>
                                                    <React.Fragment key={"three" + index}>
                                                        {digit.split(":")[1] != "0" && <TableBill key={"three_t" + index} digit={digit} digit_type={bill.digit_type} index={1} rate={rate! && String(rate!.three_digits.top!)} commission={(parseFloat(digit.split(":")[1]) / 100) * parseFloat(commissions.three_digits.top!.toString())} />}
                                                        {digit.split(":")[2] != "0" && <TableBill key={"three_b" + index} digit={digit} digit_type={bill.digit_type} index={2} rate={rate! && String(rate!.three_digits.toad!)} commission={(parseFloat(digit.split(":")[2]) / 100) * parseFloat(commissions.three_digits.toad!.toString())} />}
                                                    </React.Fragment>
                                                )
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div id="bill_footer" className="flex flex-col items-center rounded-lg w-full mb-3 p-2">
                            <div className="flex justify-center w-full p-2 gap-2">
                                <span>หมายเหตุ: {notePrice.note}</span>
                            </div>
                            <div className="flex justify-center w-full p-2 gap-2">
                                <span>รวม:</span>
                                <span>{totalPrice} บาท</span>
                            </div>
                            <div className="flex justify-center w-full p-2 gap-2">
                                <button onClick={pagePrev} style={{ minWidth: "60px" }} className="whitespace-nowrap text-xs bg-gray-400 hover:bg-gray-500 text-white font-light p-2 rounded shadow">ย้อนกลับ</button>
                                <Link to="/bill/check">
                                    <button onClick={addBillToDatabase} style={{ minWidth: "60px" }} className="whitespace-nowrap text-xs bg-blue-600 hover:bg-blue-500 text-white font-light p-2 rounded shadow">ยืนยัน</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> : <>ไม่มีอัตราการจ่าย</>
    )
}