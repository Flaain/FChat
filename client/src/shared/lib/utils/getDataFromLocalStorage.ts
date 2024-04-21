export const getDataFromLocalStorage = (...args: Array<{ key: string; defaultData: unknown }>) => {
    try {
        if (!args.length) throw new Error("Cannot get data without any arguments");

        if (args.length > 1) {
            return Object.fromEntries(args.map(({ key, defaultData }) => {
                const data = localStorage.getItem(key);
                return [key, data ? JSON.parse(data) : defaultData];
            }));
        }

        const data = localStorage.getItem(args[0].key);

        return data ? JSON.parse(data) : args[0].defaultData;
    } catch (error) {
        console.error(error);
    }
};