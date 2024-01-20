// import { useState } from "react";
// import Datepicker from "react-tailwindcss-datepicker";

// type TypeDate = {
//     startDate: string | Date | null,
//     endDate: string | Date | null
// } | null

export function OrderGroup() {
    return

    //     const [isDate, setDate] = useState<TypeDate>({
    //         startDate: new Date(),
    //         endDate: new Date().setMonth(11).toString()
    //     });


    //     const handleDateChange = (newDate: TypeDate) => {
    //         setDate(newDate)
    //     }

    //     return (
    //         <div id="order_list" className="flex flex-row">
    //             <div id="order_content" className="w-full">
    //                 <div id="order_header" className="flex flex-col w-full">
    //                     <strong className="text-lg h-10 text-[blue]">รายการแทง (ตามชนิดหวย)</strong>
    //                     <div className="flex flex-col border rounded w-full p-4">
    //                         <strong>ตัวเลือกการค้นหา</strong>
    //                         <div className="flex flex-row mt-3">
    //                             <div className="flex items-center mr-6">
    //                                 <input defaultChecked id="today" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
    //                                 <label htmlFor="today" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">วันนี้</label>
    //                             </div>
    //                             <div className="flex items-center mr-6">
    //                                 <input id="yesterday" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
    //                                 <label htmlFor="yesterday" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">เมื่อวาน</label>
    //                             </div>
    //                             <div className="flex items-center mr-6">
    //                                 <input id="weeked" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
    //                                 <label htmlFor="weeked" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">สัปดาห์นี้</label>
    //                             </div>
    //                             <div className="flex items-center mr-6">
    //                                 <input id="last_week" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
    //                                 <label htmlFor="last_week" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">สัปดาห์ที่แล้ว</label>
    //                             </div>
    //                         </div>

    //                         <div className="flex flex-row mt-3">
    //                             <div className="flex items-center mr-6">
    //                                 <input id="month" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
    //                                 <label htmlFor="month" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">เดือน</label>
    //                             </div>
    //                             <div className="flex items-center mr-6">
    //                                 <label htmlFor="select_month" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
    //                                 <select id="select_month" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    //                                     <option>-- เลือกเดือน --</option>
    //                                     <option value="1">มกราคม</option>
    //                                     <option value="2">กุมภาพันธ์</option>
    //                                     <option value="3">มีนาคม</option>
    //                                     <option value="4">เมษายน</option>
    //                                     <option value="5">พฤษภาคม</option>
    //                                     <option value="6">มิถุนายน</option>
    //                                     <option value="7">กรกฎาคม</option>
    //                                     <option value="8">สิงหาคม</option>
    //                                     <option value="9">กันยายน</option>
    //                                     <option value="10">ตุลาคม</option>
    //                                     <option value="11">พฤษจิกายน</option>
    //                                     <option value="12">ธันวาคม</option>
    //                                 </select>
    //                             </div>
    //                         </div>

    //                         <div className="flex flex-row mt-3 whitespace-nowrap">
    //                             <div className="flex items-center mr-6">
    //                                 <input id="custom_date" type="radio" name="order_filter" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
    //                                 <label htmlFor="custom_date" className="font-bold ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">เลือกวันที่</label>
    //                             </div>
    //                             <div className="flex items-center w-auto border rounded-lg w-auto">
    //                                 <Datepicker
    //                                     primaryColor="indigo"
    //                                     i18n="th"
    //                                     configs={{
    //                                         footer: {
    //                                             apply: "ยืนยัน",
    //                                             cancel: "ยกเลิก"
    //                                         }
    //                                     }}
    //                                     placeholder="ปี-เดือน-วัน ~ ปี-เดือน-วัน"
    //                                     showFooter={true}
    //                                     value={isDate}
    //                                     onChange={handleDateChange}
    //                                 />
    //                             </div>
    //                         </div>

    //                         <div className="flex flex-row mt-3">
    //                             <button className="inline-flex font-bold text-xs bg-blue-800 hover:bg-blue-700 text-white font-light p-2 px-4 rounded-md shadow">
    //                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
    //                                     <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    //                                 </svg>
    //                                 ค้นหา</button>
    //                         </div>

    //                         <div className="flex flex-row mt-3 text-xl">หวยดาวโจนส์ VIP</div>
    //                         <div className="flex flex-row mt-3">
    //                             <table className="border-collapse border border-slate-400 w-full text-center">
    //                                 <thead className="bg-blue-800 text-white text-xs">
    //                                     <tr>
    //                                         <th>วันที่</th>
    //                                         <th>ชนิดหวย</th>
    //                                         <th>ชื่องวด</th>
    //                                         <th>ยอดแทง</th>
    //                                         <th>ส่วนลด</th>
    //                                         <th>ถูกรางวัล</th>
    //                                         <th>แพ้/ชนะ</th>
    //                                         <th>หมายเหตุ</th>
    //                                         <th>#</th>
    //                                     </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                     <tr>
    //                                         <td className="border border-slate-300 font-light">2022-12-09 00:00:00</td>
    //                                         <td className="border border-slate-300 font-light">ดาวโจนส์ VIP</td>
    //                                         <td className="border border-slate-300 font-light">2022-12-08</td>
    //                                         <td className="border border-slate-300 text-green-600">70</td>
    //                                         <td className="border border-slate-300">0</td>
    //                                         <td className="border border-slate-300 text-red-500">ไม่ถูกรางวัล</td>
    //                                         <td className="border border-slate-300 text-red-500">-70</td>
    //                                         <td className="border border-slate-300 font-light">พี่อิน</td>
    //                                         <td className="border border-slate-300 font-light">
    //                                             <div className="flex flex-row justify-around items-center">
    //                                                 <button className="text-[blue] hover:text-blue-500 hover:bg-gray-100">ดูรายละเอียด</button>
    //                                                 <button className="text-xs text-red-600 hover:text-red-400 font-bold p-2 rounded shadow mx-2">
    //                                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
    //                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    //                                                     </svg></button>
    //                                             </div>
    //                                         </td>
    //                                     </tr>
    //                                     <tr>
    //                                         <td colSpan={3} className="border border-slate-300 bg-gray-200">รวม</td>
    //                                         <td className="border border-slate-300 bg-gray-200 text-green-600">70</td>
    //                                         <td className="border border-slate-300 bg-gray-200">0</td>
    //                                         <td className="border border-slate-300 bg-gray-200 text-green-600">0</td>
    //                                         <td className="border border-slate-300 bg-gray-200 text-red-500">-70</td>
    //                                         <td colSpan={2} className="border border-slate-300 bg-gray-200"></td>
    //                                     </tr>
    //                                 </tbody>
    //                             </table>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
}