import axiosClient from '../api/axiosClient';

export const settingService = {
    // Giả sử API Backend của bạn là /system-settings (Bạn đổi lại cho đúng với Controller của bạn nhé)
    getSettings: async () => {
        const res = await axiosClient.get('/system-settings');
        return res;
    }
};