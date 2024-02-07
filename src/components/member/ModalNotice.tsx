import { useNavigate } from "react-router-dom";
import { stateModal } from "../../redux/features/modal/modalSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";


export function ModalNotice() {
    const dispatch = useAppDispatch()
    const modal = useAppSelector(state => state.modal)
    const navigate = useNavigate()

    const returnToHome = () => {
        dispatch(stateModal({ show: false, openModal: modal.openModal }))
        navigate("/")
    }

    return (
        <>
            {modal.show ? (
                <>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="fixed inset-0 w-full h-full bg-black opacity-40" ></div>
                        <div className="flex items-center min-h-screen px-4 py-8">
                            <div className="relative w-full max-w-lg p-4 mx-auto bg-white shadow-lg">
                                <div className="mt-3 sm:flex">
                                    <div className="mt-2 text-center w-full">
                                        <h4 className="text-lg font-medium text-gray-800">
                                            {modal.openModal == "TIMEOUT" && "หมดเวลาแล้ว"}
                                            {modal.openModal == "ADDBILLTRUE" && "เพิ่มบิลสำเร็จ"}
                                            {modal.openModal == "ADDBILLFALSE" && "ผิดพลาด"}
                                        </h4>
                                        <div className="items-center gap-2 mt-3 sm:flex">
                                            <button
                                                className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                                                onClick={returnToHome}
                                            >
                                                ปิด
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}