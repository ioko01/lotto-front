import { Fragment, useEffect, useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { IBill } from "../../models/Bill";
import axios from "axios";
import { axiosConfig } from "../../utils/headers";
import moment from "moment";
import { ICheckReward } from "../../models/CheckReward";
import { TDate, TypeDate } from "../../models/Main";
import { stateModal } from "../../redux/features/modal/modalSlice";
import { Modal } from "../modal/Modal";
import { useAppDispatch } from "../../redux/hooks";


export function OrderGroup() {

    const [isDate, setDate] = useState<TypeDate>({
        startDate: new Date(),
        endDate: new Date()
    });

    const [disabledDatepicker, setDisabledDatepicker] = useState<boolean>(true)
    const [disabledMonth, setDisabledMonth] = useState<boolean>(true)
    const [bills, setBills] = useState<IBill[]>([])
    const [lottoGroup, setLottoGroup] = useState<string[]>([])
    const [price, setPrice] = useState<number[]>([])
    const [commission, setCommission] = useState<number[]>([])
    const [billId, setBillId] = useState<IBill>()
    const dispatch = useAppDispatch()



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

    const isLoading = document.getElementById("loading")
    const fetchBills = async () => {
        try {
            isLoading!.removeAttribute("style")
            isLoading!.style.position = "fixed"
            const start = new Date(isDate!.startDate!)
            const end = new Date(isDate!.endDate!)

            const ds = `${start.getDate()}-${start.getMonth() + 1}-${start.getFullYear()}`
            const de = `${end.getDate()}-${end.getMonth() + 1}-${end.getFullYear()}`

            const res = await axios.get(`${import.meta.env.VITE_OPS_URL}/get/bill/me/${ds}/${de}`, axiosConfig)
            if (res && res.status == 200) {
                const data = res.data as IBill[]
                let prices: number[] = []
                let commissions: number[] = []
                let group: string[] = []
                setBills(data)

                const fetchReward = await axios.get(`${import.meta.env.VITE_OPS_URL}/get/reward/lotto/${ds}/${de}`, axiosConfig)
                if (fetchReward && fetchReward.status == 200) {
                    const reward = fetchReward.data as ICheckReward[]
                    console.log(reward);
                    if (reward.length > 0) {

                    }
                }
                data.map((bill, index) => {
                    if (group.length == 0) {
                        group.push(bill.lotto_id.name)
                    } else if (!group.includes(bill.lotto_id.name)) {
                        group.push(bill.lotto_id.name)
                    }

                    //price
                    prices[index] = 0
                    commissions[index] = 0
                    if (bill.one_digits) {
                        bill.one_digits.map((p) => {
                            prices[index] += parseInt(p.split(":")[1]) + parseInt(p.split(":")[2])
                            if (bill.rate_id.committion.one_digits) {
                                commissions[index] += (parseFloat(p.split(":")[1]) * parseFloat(bill.rate_id.committion.one_digits.top!.toString()) / 100)
                                commissions[index] += (parseFloat(p.split(":")[2]) * parseFloat(bill.rate_id.committion.one_digits.bottom!.toString()) / 100)
                            }
                        })
                    }

                    if (bill.two_digits) {
                        bill.two_digits.map((p) => {
                            prices[index] += parseInt(p.split(":")[1]) + parseInt(p.split(":")[2])

                            if (bill.rate_id.committion.two_digits) {
                                commissions[index] += (parseFloat(p.split(":")[1]) * parseFloat(bill.rate_id.committion.two_digits.top!.toString()) / 100)
                                commissions[index] += (parseFloat(p.split(":")[2]) * parseFloat(bill.rate_id.committion.two_digits.bottom!.toString()) / 100)
                            }
                        })
                    }

                    if (bill.three_digits) {
                        bill.three_digits.map((p) => {
                            prices[index] += parseInt(p.split(":")[1]) + parseInt(p.split(":")[2])

                            if (bill.rate_id.committion.three_digits) {
                                commissions[index] += (parseFloat(p.split(":")[1]) * parseFloat(bill.rate_id.committion.three_digits.top!.toString()) / 100)
                                commissions[index] += (parseFloat(p.split(":")[2]) * parseFloat(bill.rate_id.committion.three_digits.toad!.toString()) / 100)
                            }
                        })
                    }

                })

                setPrice(prices)
                setCommission(commissions)
                setLottoGroup(group)
                isLoading!.style.display = "none";

            }
        } catch (error) {

        }


    }

    useEffect(() => {
        fetchBills()
    }, [])

    const render = () => {
        return (
            <>
                <div id="order_list" className="flex flex-row">
                    <div id="order_content" className="w-full">
                        <div id="order_header" className="flex flex-col w-full">
                            <strong className="text-lg h-10 text-[blue]">รายการแทง (ตามชนิดหวย)</strong>
                            <div className="flex flex-col border rounded w-full p-4">
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
                                    <div className="flex items-center mr-10">
                                        <input onChange={() => { toggleDisabled(true, true); selectDateType("THIS_WEEK"); }} id="weeked" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="weeked" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">สัปดาห์นี้</label>
                                    </div>
                                    <div className="flex items-center mr-10">
                                        <input onChange={() => { toggleDisabled(true, true); selectDateType("LAST_WEEK"); }} id="last_week" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="last_week" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">สัปดาห์ที่แล้ว</label>
                                    </div>
                                </div>

                                <div className="flex flex-row mt-3">
                                    <div style={{ width: "90px" }} className="flex items-center">
                                        <input onChange={() => { toggleDisabled(false, true); selectDateType("MONTH"); }} id="month" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="month" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">เดือน</label>
                                    </div>
                                    <div className="flex items-center mr-6">
                                        <label htmlFor="select_month" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
                                        <select onChange={(e) => { selectDateType("MONTH", parseInt(e.currentTarget.value)) }} style={{ width: "320px" }} disabled={disabledMonth} id="select_month" className="text-center transition-all duration-300 py-2.5 w-full border border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-indigo-500 focus:ring-indigo-500/20">
                                            <option className="font-normal">-- เลือกเดือน --</option>
                                            <option value="1" className="font-normal">มกราคม</option>
                                            <option value="2" className="font-normal">กุมภาพันธ์</option>
                                            <option value="3" className="font-normal">มีนาคม</option>
                                            <option value="4" className="font-normal">เมษายน</option>
                                            <option value="5" className="font-normal">พฤษภาคม</option>
                                            <option value="6" className="font-normal">มิถุนายน</option>
                                            <option value="7" className="font-normal">กรกฎาคม</option>
                                            <option value="8" className="font-normal">สิงหาคม</option>
                                            <option value="9" className="font-normal">กันยายน</option>
                                            <option value="10" className="font-normal">ตุลาคม</option>
                                            <option value="11" className="font-normal">พฤษจิกายน</option>
                                            <option value="12" className="font-normal">ธันวาคม</option>
                                        </select>
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
                                            placeholder="วัน/เดือน/ปี - วัน/เดือน/ปี"
                                            value={isDate}
                                            useRange={false}
                                            showFooter={true}
                                            separator="-"
                                            inputClassName={"relative text-center transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-indigo-500 focus:ring-indigo-500/20"}
                                            displayFormat={"DD/MM/YYYY"}
                                            onChange={handleDateChange}
                                            readOnly={true}
                                            disabled={disabledDatepicker}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row mt-3">
                                    <button onClick={fetchBills} className="inline-flex font-bold text-xs bg-blue-800 hover:bg-blue-700 text-white font-light p-2 px-4 rounded-md shadow">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                        </svg>
                                        ค้นหา</button>
                                </div>
                                {
                                    lottoGroup.map((g, index) => (
                                        <Fragment key={index}>
                                            <div key={index} className="flex flex-row mt-3 text-xl">{g}</div>
                                            <div className="flex flex-row mt-3">
                                                <table className="border-collapse border border-slate-400 w-full text-center">
                                                    <thead className="bg-blue-800 text-white text-xs">
                                                        <tr>
                                                            <th>วันที่</th>
                                                            <th>ชนิดหวย</th>
                                                            <th>ชื่องวด</th>
                                                            <th>ยอดแทง</th>
                                                            <th>ส่วนลด</th>
                                                            <th>ถูกรางวัล</th>
                                                            <th>แพ้/ชนะ</th>
                                                            <th>หมายเหตุ</th>
                                                            <th>#</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            bills.map((bill, i) => (
                                                                <Fragment key={i}>
                                                                    {
                                                                        bill.lotto_id.name == g &&
                                                                        <tr key={i}>
                                                                            <td className="border border-slate-300 font-light">{moment(new Date(Object(bill.created_at)['seconds'] * 1000 + Object(bill.created_at)['nanoseconds'] / 1000)).format("DD-MM-YYYY HH:mm:ss")}</td>
                                                                            <td className="border border-slate-300 font-light">{bill.lotto_id.name}</td>
                                                                            <td className="border border-slate-300 font-light">{new Date(bill.times.toString()).toDateString()}</td>
                                                                            <td className="border border-slate-300 text-green-600">{(price[i] - commission[i]) ? (price[i] - commission[i]).toFixed(2) : ""}</td>
                                                                            <td className="border border-slate-300">{commission[i] ? commission[i].toFixed(2) : ""}</td>
                                                                            <td className="border border-slate-300 text-red-500">{bill.status == "WAIT" ? "รอผล" : bill.status == "CANCEL" ? "ยกเลิก" : bill.status == "REWARD" && "ไม่ถูกรางวัล"}</td>
                                                                            <td className="border border-slate-300 text-red-500">-70</td>
                                                                            <td className="border border-slate-300 font-light">{bill.note}</td>
                                                                            <td className="border border-slate-300 font-light">
                                                                                <div className="flex flex-row justify-around items-center">
                                                                                    <button onClick={() => { setBillId(bill); dispatch(stateModal({ show: true, openModal: "CONFIG", confirm: false })) }} className="text-[blue] hover:text-blue-500 hover:bg-gray-100">ดูรายละเอียด</button>
                                                                                    <button className="text-xs text-red-600 hover:text-red-400 font-bold p-2 rounded shadow mx-2">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                                        </svg></button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>


                                                                    }
                                                                </Fragment>

                                                            ))
                                                        }

                                                        <tr>
                                                            <td colSpan={3} className="border border-slate-300 bg-gray-200">รวม</td>
                                                            <td className="border border-slate-300 bg-gray-200 text-green-600">{
                                                                (Object.values(bills).map<number>((b: IBill, i) => {
                                                                    let iTotal = 0;
                                                                    if (b.lotto_id.name == g) iTotal += price[i]
                                                                    return iTotal
                                                                }).reduce((price, cur) => price + cur, 0)
                                                                    -
                                                                    Object.values(bills).map<number>((b: IBill, i) => {
                                                                        let iTotal = 0;
                                                                        if (b.lotto_id.name == g) iTotal += commission[i]
                                                                        return iTotal
                                                                    }).reduce((price, cur) => price + cur, 0)).toFixed(2)
                                                            }</td>
                                                            <td className="border border-slate-300 bg-gray-200">{
                                                                Object.values(bills).map<number>((b: IBill, i) => {
                                                                    let iTotal = 0;
                                                                    if (b.lotto_id.name == g) iTotal += commission[i]
                                                                    return iTotal
                                                                }).reduce((price, cur) => price + cur, 0).toFixed(2)
                                                            }</td>
                                                            <td className="border border-slate-300 bg-gray-200 text-green-600">0</td>
                                                            <td className="border border-slate-300 bg-gray-200 text-red-500">-70</td>
                                                            <td colSpan={2} className="border border-slate-300 bg-gray-200"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Fragment>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Modal>
                    <div id="bill_check" className="flex flex-col">
                        <div className="flex flex-row text-sm">
                            <div className="basis-6/6 w-full p-2">
                                <div id="bill_content" className="flex flex-col items-center">
                                    <div id="bill_header" className="flex flex-col items-start rounded-sm w-full mb-3 p-2">
                                        <span>
                                            [{billId?.lotto_id.name}]  &nbsp;
                                            {billId?.times ? new Date(billId?.times.toString()).toDateString(): ""} &nbsp;
                                            {billId?.status == "WAIT" && <span className="bg-yellow-500 text-sm px-1 rounded">ส่งโพย</span>}
                                            {billId?.status == "REWARD" && <span className="bg-blue-500 text-white text-sm px-1 rounded">ออกรางวัล</span>}
                                            {billId?.status == "CANCEL" && <span className="bg-red-500 text-white text-sm px-1 rounded">ยกเลิกโพย</span>}
                                        </span>
                                    </div>
                                    <div id="bill_body" className="flex flex-col items-center w-full p-2">
                                        <table className="border-collapse border border-slate-300 w-full text-xs">
                                            <thead className="bg-blue-800 text-white text-center">
                                                <tr>
                                                    <th className="border border-slate-300">ประเภท @ หมายเลข</th>
                                                    <th className="border border-slate-300">ยอดเดิมพัน</th>
                                                    <th className="border border-slate-300">ส่วนลด</th>
                                                    <th className="border border-slate-300">
                                                        <div className="flex justify-between px-1">
                                                            <span>
                                                                จ่าย
                                                            </span>
                                                            <span>
                                                                รวม
                                                            </span>
                                                        </div>

                                                    </th>
                                                    <th className="border border-slate-300">สถานะ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    billId?.one_digits?.map(one => (
                                                        parseInt(one.split(":")[1]) > 0 &&
                                                        <tr>
                                                            <td className="border border-slate-300 text-center font-light">วิ่งบน @ {one.split(":")[0]}</td>
                                                            <td className="border border-slate-300 text-center font-light">{parseInt(one.split(":")[1]).toFixed(2)}</td>
                                                            <td className="border border-slate-300 text-center font-light">{(parseInt(one.split(":")[1]) * parseInt(billId.rate_id.committion.one_digits.top as string)) / 100}</td>
                                                            <td className="border border-slate-300 text-center">
                                                                <div className="flex justify-between px-1">
                                                                    <span className="font-light">{billId.rate_id.one_digits.top}</span>
                                                                    <span className="font-light">{parseInt(billId.rate_id.one_digits.top as string) * parseInt(one.split(":")[1])}</span>
                                                                </div>
                                                            </td>
                                                            <td className="border border-slate-300 text-center font-light"></td>
                                                        </tr>
                                                    ))
                                                }
                                                {
                                                    billId?.one_digits?.map(one => (
                                                        parseInt(one.split(":")[2]) > 0 &&
                                                        <tr>
                                                            <td className="border border-slate-300 text-center font-light">วิ่งล่าง @ {one.split(":")[0]}</td>
                                                            <td className="border border-slate-300 text-center font-light">{parseInt(one.split(":")[2]).toFixed(2)}</td>
                                                            <td className="border border-slate-300 text-center font-light">{(parseInt(one.split(":")[2]) * parseInt(billId.rate_id.committion.one_digits.bottom as string)) / 100}</td>
                                                            <td className="border border-slate-300 text-center">
                                                                <div className="flex justify-between px-1">
                                                                    <span className="font-light">{billId.rate_id.one_digits.bottom}</span>
                                                                    <span className="font-light">{parseInt(billId.rate_id.one_digits.bottom as string) * parseInt(one.split(":")[2])}</span>
                                                                </div>
                                                            </td>
                                                            <td className="border border-slate-300 text-center font-light"></td>
                                                        </tr>
                                                    ))
                                                }
                                                {
                                                    billId?.two_digits?.map(two => (
                                                        parseInt(two.split(":")[1]) > 0 &&
                                                        <tr>
                                                            <td className="border border-slate-300 text-center font-light">2 ตัวบน @ {two.split(":")[0]}</td>
                                                            <td className="border border-slate-300 text-center font-light">{parseInt(two.split(":")[1]).toFixed(2)}</td>
                                                            <td className="border border-slate-300 text-center font-light">{(parseInt(two.split(":")[1]) * parseInt(billId.rate_id.committion.two_digits.top as string)) / 100}</td>
                                                            <td className="border border-slate-300 text-center">
                                                                <div className="flex justify-between px-1">
                                                                    <span className="font-light">{billId.rate_id.two_digits.top}</span>
                                                                    <span className="font-light">{parseInt(billId.rate_id.two_digits.top as string) * parseInt(two.split(":")[1])}</span>
                                                                </div>
                                                            </td>
                                                            <td className="border border-slate-300 text-center font-light"></td>
                                                        </tr>
                                                    ))
                                                }
                                                {
                                                    billId?.two_digits?.map(two => (
                                                        parseInt(two.split(":")[2]) > 0 &&
                                                        <tr>
                                                            <td className="border border-slate-300 text-center font-light">2 ตัวล่าง @ {two.split(":")[0]}</td>
                                                            <td className="border border-slate-300 text-center font-light">{parseInt(two.split(":")[2]).toFixed(2)}</td>
                                                            <td className="border border-slate-300 text-center font-light">{(parseInt(two.split(":")[2]) * parseInt(billId.rate_id.committion.two_digits.bottom as string)) / 100}</td>
                                                            <td className="border border-slate-300 text-center">
                                                                <div className="flex justify-between px-1">
                                                                    <span className="font-light">{billId.rate_id.two_digits.bottom}</span>
                                                                    <span className="font-light">{parseInt(billId.rate_id.two_digits.bottom as string) * parseInt(two.split(":")[2])}</span>
                                                                </div>
                                                            </td>
                                                            <td className="border border-slate-300 text-center font-light"></td>
                                                        </tr>
                                                    ))
                                                }
                                                {
                                                    billId?.three_digits?.map(three => (
                                                        parseInt(three.split(":")[1]) > 0 &&
                                                        <tr>
                                                            <td className="border border-slate-300 text-center font-light">3 ตัวบน @ {three.split(":")[0]}</td>
                                                            <td className="border border-slate-300 text-center font-light">{parseInt(three.split(":")[1]).toFixed(2)}</td>
                                                            <td className="border border-slate-300 text-center font-light">{(parseInt(three.split(":")[1]) * parseInt(billId.rate_id.committion.three_digits.top as string)) / 100}</td>
                                                            <td className="border border-slate-300 text-center">
                                                                <div className="flex justify-between px-1">
                                                                    <span className="font-light">{billId.rate_id.three_digits.top}</span>
                                                                    <span className="font-light">{parseInt(billId.rate_id.three_digits.top as string) * parseInt(three.split(":")[1])}</span>
                                                                </div>
                                                            </td>
                                                            <td className="border border-slate-300 text-center font-light"></td>
                                                        </tr>
                                                    ))
                                                }
                                                {
                                                    billId?.three_digits?.map(three => (
                                                        parseInt(three.split(":")[2]) > 0 &&
                                                        <tr>
                                                            <td className="border border-slate-300 text-center font-light">3 ตัวโต๊ด @ {three.split(":")[0]}</td>
                                                            <td className="border border-slate-300 text-center font-light">{parseInt(three.split(":")[2]).toFixed(2)}</td>
                                                            <td className="border border-slate-300 text-center font-light">{(parseInt(three.split(":")[2]) * parseInt(billId.rate_id.committion.three_digits.toad as string)) / 100}</td>
                                                            <td className="border border-slate-300 text-center">
                                                                <div className="flex justify-between px-1">
                                                                    <span className="font-light">{billId.rate_id.three_digits.toad}</span>
                                                                    <span className="font-light">{parseInt(billId.rate_id.three_digits.toad as string) * parseInt(three.split(":")[2])}</span>
                                                                </div>
                                                            </td>
                                                            <td className="border border-slate-300 text-center font-light"></td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>
                                        </table>
                                    </div>

                                    <div id="bill_footer" className="flex flex-col items-center rounded-lg w-full mb-3 p-2">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </>
        )
    }

    return (
        render()
    )
}