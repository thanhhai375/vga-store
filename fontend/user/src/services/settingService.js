import axiosClient from '../api/axiosClient';

export const settingService = {
    // Gi s API Backend ca bn l /system-settings (Bn i li cho ng vi Controller ca bn nh)
    getSettings: async () => {
        const res = await axiosClient.get('/system-settings');
        return res;
    }
};
