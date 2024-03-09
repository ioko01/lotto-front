import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";
import axios from "axios";
import { axiosConfig } from "../../utils/headers";
import { ILotto, TLottoStatusEnum } from "../../models/Lotto";
import { countdown } from "../../utils/countdown";
import { Time } from "../../models/Time";
import { ILottoDoc } from "../../models/Id";
import { Modal } from "../modal/Modal";

interface ImageBase64 {
    name: string
    data: string
}

export function Home() {
    const { isUser } = useContext(AuthContext)
    const [lotto, setLotto] = useState<ILottoDoc[] | null>(null)

    const [times, setTimes] = useState<Time[]>([])
    // let newTimes: Time[] = [];
    let count = 0
    const isLoading = document.getElementById("loading")


    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dateNow = new Date();

    const fetchLottoAll = async () => {
        try {
            isLoading!.removeAttribute("style")
            isLoading!.style.position = "fixed"
            const res = await axios.get(import.meta.env.VITE_OPS_URL + "/get/lotto/all", axiosConfig)
            const lottos = res.data as ILottoDoc[]
            setLotto(lottos)

            if (lottos && res.status == 200) {
                mapLotto(lottos!)
                lottos!.map((res) => {
                    const this_hours = new Date().getHours()
                    const this_minutes = new Date().getMinutes()
                    const t = `${this_hours}:${this_minutes}`

                    const cd = countdown(res.open, res.close, getTomorrow(res.open, res.close, t))
                    if (cd.days < 0) {
                        if (res.status == TLottoStatusEnum.OPEN) axios.put(`${import.meta.env.VITE_OPS_URL}/status/lotto`, { id: res.id, status: TLottoStatusEnum.CLOSE }, axiosConfig)
                    } else {
                        if (res.status == TLottoStatusEnum.CLOSE) {
                            axios.put(`${import.meta.env.VITE_OPS_URL}/status/lotto`, { id: res.id, status: TLottoStatusEnum.OPEN }, axiosConfig)
                        }
                    }
                })
            }
            isLoading!.style.display = "none";
        } catch (error) {

        }
    }

    const [image, setImage] = useState<ImageBase64[]>([]);
    const fetchImage = async (lotto: ILotto, amount: number) => {
        try {
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
                    if (image.length < amount) {
                        setImage(prevArray => [...prevArray, { name: lotto.name, data: base64data!.toString() }])
                    }
                };
            }
        } catch (error) {

        }
    }

    const timer = (id: string, open: string, close: string, status: TLottoStatusEnum, amount: number) => {
        const interval = setInterval(() => {
            const this_hours = new Date().getHours()
            const this_minutes = new Date().getMinutes()
            const t = `${this_hours}:${this_minutes}`

            const cd = countdown(open, close, getTomorrow(open, close, t))
            if (count >= amount) {
                // newTimes = []
                setTimes([])
                count = 0
            }
            // if (cd.days < 0) {
            //     clearInterval(interval)
            // }

            const days = status == TLottoStatusEnum.OPEN ? cd.days < 10 ? `0${cd.days.toString()}` : cd.days.toString() : "00"
            const hours = status == TLottoStatusEnum.OPEN ? cd.hours < 10 ? `0${cd.hours.toString()}` : cd.hours.toString() : "00"
            const minutes = status == TLottoStatusEnum.OPEN ? cd.minutes < 10 ? `0${cd.minutes.toString()}` : cd.minutes.toString() : "00"
            const seconds = status == TLottoStatusEnum.OPEN ? cd.seconds < 10 ? `0${cd.seconds.toString()}` : cd.seconds.toString() : "00"
            // console.log(newTimes);
            // newTimes = [...newTimes,]

            setTimes((prevState) => [...prevState, {
                id: id,
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }])
            count++
        }, 1000)

    }

    const mapLotto = (data: ILottoDoc[]) => {
        if (data) {
            data!.map((res) => {
                timer(res.id, res.open, res.close, res.status as TLottoStatusEnum, data.length)
                fetchImage(res, data.length)
            })
        }
    }

    const getTomorrow = (t1: string, t2: string, t3: string) => {
        //check เวลาปิดน้อยกว่าหรือเท่ากับเวลาเปิด ถ้าน้อยกว่า จะเท่ากับงวด พรุ่งนี้
        if (parseInt(t2.split(":")[0]) <= parseInt(t1.split(":")[0])) {
            // ถ้าเวลาปิด == เวลาเปิด
            if (parseInt(t2.split(":")[0]) == parseInt(t1.split(":")[0])) {
                // ให้เช็ค นาที ปิด น้อยกว่า นาทีเปิด
                if (parseInt(t2.split(":")[1]) < parseInt(t1.split(":")[1])) return true
                return false
            }
            return true
        }
        return false
    }

    const getCountdownTime = (t1: string, t2: string, t3: string) => {
        //check เวลาปิดน้อยกว่าหรือเท่ากับเวลาเปิด ถ้าน้อยกว่า จะเท่ากับงวด พรุ่งนี้
        if (parseInt(t2.split(":")[0]) <= parseInt(t1.split(":")[0])) {
            // ถ้าเวลาปิด == เวลาเปิด
            if (parseInt(t2.split(":")[0]) == parseInt(t1.split(":")[0])) {
                // ให้เช็ค นาที ปิด น้อยกว่า นาทีเปิด
                if (parseInt(t2.split(":")[1]) < parseInt(t1.split(":")[1])) return true
                return false
            }
            return true
        } else {
            if (parseInt(t3.split(":")[0]) <= parseInt(t2.split(":")[0])) {
                if (parseInt(t3.split(":")[0]) == parseInt(t2.split(":")[0])) {
                    // ให้เช็ค นาที ปิด น้อยกว่า นาทีเปิด
                    if (parseInt(t3.split(":")[1]) < parseInt(t2.split(":")[1])) return true
                    return false
                }
                return true
            }
            return false
        }
    }

    const previewImage = (lotto: ILottoDoc) => {
        let img = ""
        image.map((im) => {
            if (lotto.name!.match(im.name)) img = im.data
        })
        return img
    }


    const display = () => {
        const hours = new Date().getHours()
        const minutes = new Date().getMinutes()
        const t = `${hours}:${minutes}`
        return lotto?.map((lot, index) => (
            <div key={index} className="p-2 xl:basis-1/5 lg:basis-1/4 basis-1/3">
                <Link to={getCountdownTime(lot.open, lot.close, t) ? times ? lot.date!.includes(day[dateNow.getDay()]) && lot.status == TLottoStatusEnum.OPEN ? `/bill/${lot.id}` : '#' : '#' : '#'} className={`flex flex-col items-center rounded-none shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ${getCountdownTime(lot.open, lot.close, t) ? times ? lot.date!.includes(day[dateNow.getDay()]) && lot.status == TLottoStatusEnum.OPEN ? `bg-green-600 text-white` : `bg-gray-300 text-dark` : `bg-gray-300 text-dark` : `bg-gray-300 text-dark`}`}>
                    <div className="flex flex-row items-center p-2 w-full">
                        <img style={{ height: 40 }} className="object-cover rounded-none" src={previewImage(lot)} alt={lot.name} />
                        <div className="flex text-end w-full flex-col justify-between leading-normal">
                            <h5 className="text-sm font-bold tracking-tight dark:text-white">{lot.name}
                                <br />
                                {
                                    lot.date!.includes(day[dateNow.getDay()]) && lot.status == TLottoStatusEnum.OPEN ? `เปิดรับ ${String(lot.open)}` : `ปิดรับ`
                                }
                            </h5>
                        </div>
                    </div>

                    <hr className="w-full" />
                    <div className="w-full text-xs px-2">
                        <p className="flex justify-between w-full">
                            <span className="font-light">เวลาปิด</span>
                            <span className="font-light">{(lot.date!.includes(day[dateNow.getDay()]) && lot.status) == TLottoStatusEnum.OPEN ? String(lot.close) : `-`}</span>
                        </p>
                        <p className="flex justify-between w-full">
                            <span className="font-light">สถานะ</span>
                            <span className="font-light">{getCountdownTime(lot.open, lot.close, t) ? lot.date!.includes(day[dateNow.getDay()]) && times[index] ? times[index].id == lot.id ? `ปิดรับใน ${times[index]?.hours ?? "00"}:${times[index]?.minutes ?? "00"}:${times[index]?.seconds ?? "00"}` : '-' : '-' : 'ปิดรับ'}</span>
                        </p>
                    </div>
                </Link>
            </div>
        ))

    }


    useEffect(() => {
        fetchLottoAll()
    }, [])




    return (
        <>{
            isUser &&
            <div id="home" className="flex flex-row flex-wrap">
                {
                    display()
                }
            </div>
        }
        </>
    )
}

// `ปิดรับใน ${t.hours}:${t.minutes}:${t.seconds}` : '-'