import { Typography } from '@/shared/ui/Typography';
import { ActiveSessionsSkeleton } from './Skeletons/ActiveSessionsSkeleton';
import { useActiveSessions } from '../lib/useActiveSessions';
import { Button } from '@/shared/ui/Button';
import { Hand, Loader2 } from 'lucide-react';
import { Session } from '@/entities/session/ui/ui';
import { useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';

export const ActiveSessions = () => {
    const { sessions, isLoading, isTerminating, handleTerimanteSessions, handleDropSession } = useActiveSessions();
    const { onCloseModal, onOpenModal } = useModal();

    if (isLoading) return <ActiveSessionsSkeleton />;

    const onConfirm = () => {
        onCloseModal();
        handleTerimanteSessions();
    }

    return (
        <div className='flex flex-col gap-3 px-5 pt-5'>
            {sessions ? (
                <div className='flex flex-col gap-5'>
                    <Typography as='h2' variant='primary' weight='medium'>
                        This device
                    </Typography>
                    <Session session={sessions.currentSession} />
                    {!!sessions.sessions.length && (
                        <>
                            <Button
                                onClick={() =>
                                    onOpenModal({
                                        withHeader: false,
                                        bodyClassName: 'max-w-[350px] p-5 h-auto',
                                        content: (
                                            <Confirm
                                                text='Are you sure you want to terminate all other sessions?'
                                                onCancel={onCloseModal}
                                                onConfirm={onConfirm}
                                            />
                                        )
                                    })
                                }
                                disabled={isTerminating}
                                variant='ghost'
                                className='gap-5 dark:text-primary-destructive text-primary-destructive'
                            >
                                {isTerminating ? <Loader2 className='w-5 h-5 animate-spin' /> : <Hand className='w-5 h-5' />}
                                Terminate all other sessions
                            </Button>
                            <Typography as='h2' variant='primary' weight='medium'>
                                Other devices
                            </Typography>
                            <ul className='flex flex-col gap-2 max-h-[210px] overflow-auto'>
                                {sessions.sessions.map((session) => (
                                    <li key={session._id}>
                                        <Session
                                            session={session}
                                            withDropButton
                                            dropButtonDisabled={isTerminating}
                                            onDrop={() => handleDropSession(session._id)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            ) : (
                <Typography as='h2' variant='secondary' weight='medium' className='self-center'>
                    Failed to load sessions
                </Typography>
            )}
        </div>
    );
};