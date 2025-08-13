import dayjs from "dayjs";

export const unixToYears = (value: number) => {
    return Math.floor(dayjs.duration(dayjs().unix() - value, "seconds").asYears());
};
