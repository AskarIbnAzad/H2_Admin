import { toast } from "react-toastify"

export const success_toast_message = (label) => {
    // const { label } = prpos
    return toast.success(label, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true
    })
}
export const error_toast_message = (label) => {
    // const { label } = prpos
    return toast.error(label, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true
    })
}