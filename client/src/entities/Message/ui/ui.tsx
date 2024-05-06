import Typography from "@/shared/ui/Typography";
import AvatarByName from "@/shared/ui/AvatarByName";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";
import { Message } from "@/shared/model/types";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { forwardRef } from "react";

const Message = forwardRef<HTMLLIElement, Message>(({ createdAt, hasBeenRead, sender, text }, ref) => {
    const {
        state: { userId },
    } = useSession();
    const isMessageFromMe = sender._id === userId;

    return (
        <li
            ref={ref}
            className={cn("flex items-center gap-5", {
                "self-end": isMessageFromMe,
                "self-start": !isMessageFromMe,
            })}
        >
            {!isMessageFromMe && <AvatarByName name={sender.name} className='self-end' />}
            <div className='flex flex-col'>
                <div className='flex items-center gap-5'>
                    {!isMessageFromMe && (
                        <Typography as='h3' variant='primary' weight='medium'>
                            {sender.name}
                        </Typography>
                    )}
                    <Typography className='self-end ml-auto' variant='secondary'>
                        {new Date(createdAt).toLocaleTimeString(navigator.language, {
                            hour: "numeric",
                            minute: "numeric",
                        })}
                    </Typography>
                </div>
                <Typography
                    as='p'
                    className={cn("px-5 py-1 rounded-xl mt-2 max-w-[500px] flex items-end gap-4", {
                        "dark:bg-primary-dark-50 bg-primary-white dark:text-primary-white": !isMessageFromMe,
                        "dark:bg-primary-white dark:text-primary-dark-200": isMessageFromMe,
                    })}
                >
                    {text}
                    <Typography title={hasBeenRead ? "message was read" : "message not read yet"}>
                        {hasBeenRead ? (
                            <CheckCheck
                                className={cn("w-4 h-4", {
                                    "dark:text-primary-white text-primary-dark-200 w-4 h-4": !isMessageFromMe,
                                    "dark:text-primary-dark-200 text-primary-white w-4 h-4": isMessageFromMe,
                                })}
                            />
                        ) : (
                            <Check
                                className={cn("w-4 h-4", {
                                    "dark:text-primary-white text-primary-dark-200 w-4 h-4": !isMessageFromMe,
                                    "dark:text-primary-dark-200 text-primary-white w-4 h-4": isMessageFromMe,
                                })}
                            />
                        )}
                    </Typography>
                </Typography>
            </div>
        </li>
    );
});

export default Message;