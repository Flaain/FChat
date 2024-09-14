export const getBubblesStyles = ({ isMessageFromMe, isFirst, isLast }: { isMessageFromMe: boolean, isLast: boolean, isFirst: boolean }) => {
    if (isMessageFromMe) {
        return {
            ['dark:bg-primary-white bg-primary-dark-50 rounded-ss-[15px] rounded-es-[15px]']: true,
            ['before:-right-5 dark:before:shadow-[-13px_0_0_#F9F9F9] rounded-se-[5px] rounded-es-[15px] rounded-ee-[0px] relative before:absolute before:w-[20px] before:h-[15px] before:bg-transparent before:-bottom-0 before:rounded-bl-3xl']: isLast,
            ['rounded-se-[15px] rounded-ee-[5px]']: isFirst,
            ['rounded-se-[5px] rounded-ee-[5px]']: !isFirst && !isLast,
            ['rounded-se-[15px] rounded-ee-[0px]']: isFirst && isLast,
        }
    } else {
        return {
            ['self-start dark:bg-primary-dark-50 bg-primary-gray rounded-se-[15px] rounded-ee-[15px]']: true,
            ['before:-left-5 rounded-ss-[5px] dark:before:shadow-[13px_0_0_#424242] before:shadow-[13px_0_0_#EEE] rounded-es-[0px] rounded-ee-[15px] relative before:absolute before:w-[20px] before:h-[15px] before:bg-transparent before:-bottom-0 before:rounded-br-3xl']: isLast,
            ['rounded-ss-[15px] rounded-es-[5px]']: isFirst,
            ['rounded-es-[5px] rounded-ee-[15px] rounded-ss-[5px]']: !isFirst && !isLast,
            ['rounded-ss-[15px] rounded-es-[0px]']: isFirst && isLast,
        }
    }
}