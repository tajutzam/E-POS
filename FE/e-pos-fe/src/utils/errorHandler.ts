import { toast } from 'react-hot-toast';

export const displayError = (error: any) => {
    const errorData = error.response?.data;


    if (errorData?.message === "Validation Failed" && errorData?.data) {
        const validationErrors = errorData.data;

        Object.entries(validationErrors).forEach(([field, msg]) => {
            toast.error(`${field}: ${msg}`, {
                id: `${field}-error`,
            });
        });
        return;
    }

    if (errorData?.message) {
        toast.error(errorData.message);
        return;
    }

    if (error.message === "Network Error") {
        toast.error("Koneksi ke server terputus. Pastikan backend menyala.");
        return;
    }

    toast.error("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
    console.error("Unhandled Error Log:", error);
};