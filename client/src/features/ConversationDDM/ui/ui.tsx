import { EllipsisVertical, Trash } from "lucide-react";
import { useConversationDDM } from "../lib/hooks/useConversationDDM";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

const ConversationDDM = () => {
    const { isMenuOpen, onClickDeleteConversation, setIsMenuOpen } = useConversationDDM();

    return (
        <DropdownMenu onOpenChange={setIsMenuOpen} open={isMenuOpen}>
            <DropdownMenuTrigger
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className='hover:opacity-50 transition-opacity ease-in-out duration-200 outline-none'
            >
                <EllipsisVertical className='dark:text-primary-white text-primary-dark-50' />
            </DropdownMenuTrigger>
            <DropdownMenuContent loop align="end" className='border-none rounded w-[200px] h-auto dark:bg-primary-dark-50 z-[999]'>
                <DropdownMenuItem className='flex items-center gap-5 cursor-pointer rounded dark:focus:bg-primary-dark-100/20 text-primary-white'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    >
                        <path d='m13 11 9-9' />
                        <path d='M14.6 12.6c.8.8.9 2.1.2 3L10 22l-8-8 6.4-4.8c.9-.7 2.2-.6 3 .2Z' />
                        <path d='m6.8 10.4 6.8 6.8' />
                        <path d='m5 17 1.4-1.4' />
                    </svg>
                    Clear history
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onClickDeleteConversation}
                    className='flex items-center gap-5 cursor-pointer rounded dark:focus:bg-primary-destructive/10 text-primary-destructive'
                >
                    <Trash className='w-5 h-5' /> Delete conversation
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ConversationDDM;