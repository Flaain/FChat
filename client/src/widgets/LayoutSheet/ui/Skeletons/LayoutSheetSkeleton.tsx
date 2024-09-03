import AvatarByName from "@/shared/ui/AvatarByName";
import Typography from "@/shared/ui/Typography";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { cn } from "@/shared/lib/utils/cn";
import { Verified } from "lucide-react";

const LayoutSheetSkeleton = () => {
    const { profile } = useProfile();

    return (
        <div className='flex flex-col py-8 h-full'>
            <div className='flex flex-col gap-2 items-start px-4'>
                {profile.avatar ? <img src={profile.avatar} className='size-[50px] rounded-full' /> : <AvatarByName name={profile.name} size='lg' />}
                <Typography as='h2' size='lg' weight='medium' className={cn(profile.isOfficial && 'flex items-center')}>
                    {profile.name}
                    {profile.isOfficial && (
                        <Typography className='ml-2'>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
            </div>
            <ul className='flex flex-col gap-5'>
                {[...new Array(5)].map((_, index) => (
                    <li
                        key={index}
                        className='flex first:my-4 first:py-1 first:border-y dark:first:border-primary-dark-50 first:border-primary-dark-200'
                    >
                        <span className='dark:bg-primary-dark-50 w-full h-[30px] space-y-5 relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-200/10 before:to-transparent overflow-hidden isolate before:border-t before:border-primary-gray/30'></span>
                    </li>
                ))}
            </ul>
            <Typography as='p' variant='secondary' className='mt-auto px-4'>
                FChat Web, {new Date().getFullYear()}
            </Typography>
        </div>
    );
};

export default LayoutSheetSkeleton;