export const getRelativeTimeString = (date: Date | number | string, lang = navigator.language, options: Intl.RelativeTimeFormatOptions = { numeric: "auto" }) => {
    const timeMS = date instanceof Date ? date.getTime() : new Date(date).getTime();
    const deltaSeconds = Math.round((timeMS - Date.now()) / 1000);

    const cuttoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
    const units: Array<Intl.RelativeTimeFormatUnit> = ["second", "minute", "hour", "day", "week", "month", "year"];
    const unitIndex = cuttoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
    const divisor = unitIndex ? cuttoffs[unitIndex - 1] : 1;
    
    const rtf = new Intl.RelativeTimeFormat(lang, options);

    return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
};