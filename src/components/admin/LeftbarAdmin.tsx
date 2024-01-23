import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Home } from "../member/Home";
import { Bill } from "../member/Bill";
// import { OrderList } from "./OrderList";
// import { OrderGroup } from "./OrderGroup";
import { Report } from "../member/Report";
import { Reward } from "../member/Reward";
import { Rule } from "../member/Rule";
import { Howto } from "../member/Howto";
import { BillCheck } from "../member/BillCheck";
import { PageNotFound } from "../member/PageNotFound";
import { NavLink } from "react-router-dom";
import { Link } from "../member/Link";
import { IUser } from "../../models/User";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { axiosConfig } from "../../utils/headers";
import { Cookies } from "typescript-cookie";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { stateRoute } from "../../redux/features/route/routeSlice";
import { io } from "../../utils/socket-io";
import ManageUser from "./ManageUser";
import { Dashboard } from "./Dashboard";
import ManageStores from "./ManageStores";
import ManageLotto from "./ManageLotto";
import ManageRate from "./ManageRate";

export function LeftbarAdmin() {
    const { isUser, status, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const isLoading = document.getElementById("loading")
    const dispatch = useAppDispatch()
    const route = useAppSelector(state => state.route)
    const location = useLocation()
    const [isRoute, setIsRoute] = useState("")


    if (isLoading) {
        setTimeout(() => {
            if (status === "SUCCESS" || status === "LOGOUT") {
                isLoading.style.display = "none"
            } else {
                isLoading.removeAttribute("style")
                isLoading.style.position = "fixed"
            }
        }, 100)
    }

    const addDigitClose = () => {
        try {
            // const id = location.pathname.split("/")[2]
            const id = "hPdmKyX882ZvsYneMWum"
            const data = {
                "lotto_id": id,
                "percent": 0,
                "rate_id": "ypfECvkmXSwlyRRcsA4B",
                "store_id": "x5yMN7OQV6S3twadJZEi",
                "one_digits": {
                    "top": [],
                    "bottom": []
                },
                "two_digits": {
                    "top": ["15", "51", "16", "61"],
                    "bottom": ["15", "51"]
                },
                "three_digits": {
                    "top": [],
                    "bottom": []
                }
            }
            axios.post(import.meta.env.VITE_OPS_URL + `/add/digitclose`, data, axiosConfig)
                .then(() => {
                    io.connect()
                    io.emit("create_digit_close")
                    io.disconnect()
                }).catch((err) => {
                    if (err.response.data.message == "this digit close has been used") {
                        console.log("this digit close has been used");
                    }
                })
        } catch (error) {
        }
    }

    const handleSubmit = async () => {
        try {
            isLoading!.removeAttribute("style")
            logout(isUser!.username).then(() => {
                navigate("/")
            })
        } catch (error) {
            // console.log(error);
        }
    }

    const toggleMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.currentTarget.classList.toggle("active")
        e.currentTarget.nextElementSibling?.classList.toggle("hidden")
    }

    return (
        isUser &&
        <div className="flex">
            <aside id="logo-sidebar" className="top-0 left-0 z-1 w-64 h-screen" aria-label="Sidebar">
                <div className="w-full h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <a href="https://flowbite.com/" className="flex items-center pl-2.5 mb-5">
                        <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 mr-3 sm:h-7" alt="Flowbite Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                    </a>
                    <ul className="space-y-2">
                        <li>
                            <NavLink to={"/"} className={({ isActive }) => "flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" + (isActive && " bg-blue-600 text-white hover:bg-blue-500")}>
                                <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                <span className="ml-3">Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/users/manage"} className={({ isActive }) => "flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" + (isActive && " bg-blue-600 text-white hover:bg-blue-500")}>
                                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">จัดการสมาชิก</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/stores/manage"} className={({ isActive }) => "flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" + (isActive && " bg-blue-600 text-white hover:bg-blue-500")}>
                                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">จัดการร้าน</span>
                            </NavLink>
                        </li>
                        <li>
                            <button onClick={toggleMenu} className={"flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"} aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">รายการหวย</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                            <ul id="lotto-list" className={"py-2 space-y-2" + (location.pathname.split("/")[1] !== "lottos" && " hidden")}>
                                <li>
                                    <NavLink to={"lottos/manage"} className={({ isActive }) => "flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" + (isActive && " text-blue-600")}>รายการหวยทั้งหมด</NavLink>
                                </li>
                                <li>
                                    <a href="#" onClick={addDigitClose} className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">จัดการรายการหวย</a>
                                </li>
                                <li>
                                    <NavLink to={"rates/manage"} onClick={addDigitClose} className={({ isActive }) => "flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" + (isActive && " text-blue-600")}>เรทการจ่าย</NavLink>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button onClick={toggleMenu} className={"flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"} aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">การเงิน</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                            <ul id="credits" className={"py-2 space-y-2" + (location.pathname.split("/")[1] !== "credits" && " hidden")}>
                                <li>
                                    <a href="#" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">ฝาก/ถอนเงิน</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button onClick={toggleMenu} className={"flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"} aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">สรุปผลแพ้/ชนะ</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                            <ul id="summary" className={"py-2 space-y-2" + (location.pathname.split("/")[1] !== "summary" && " hidden")}>
                                <li>
                                    <a href="#" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">รายงานยอดสุทธิ</a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">ตรวจรางวัล</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button onClick={handleSubmit} className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">ออกจากระบบ</span>
                                <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>

            <div style={{ minWidth: "768px" }} className="p-4 w-full">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users/manage" element={<ManageUser />} />
                        <Route path="/lottos/manage" element={<ManageLotto />} />
                        <Route path="/stores/manage" element={<ManageStores />} />
                        <Route path="/rates/manage" element={<ManageRate />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}