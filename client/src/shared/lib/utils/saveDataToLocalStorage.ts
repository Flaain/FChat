export const saveDataToLocalStorage = (...args: Array<{ key: string; data: unknown }>) => {
    try {
        args.forEach(({ key, data }) => localStorage.setItem(key, JSON.stringify(data)));
    } catch (error) {
        console.error(error);
    }
};