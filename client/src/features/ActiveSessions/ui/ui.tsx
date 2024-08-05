import Typography from '@/shared/ui/Typography';
import ActiveSessionsSkeleton from './Skeletons/ActiveSessionsSkeleton';
import Session from '@/entities/session/ui/ui';
import Confirm from '@/widgets/Confirm/ui/ui';
import { useActiveSessions } from '../lib/hooks/useActiveSessions';
import { Button } from '@/shared/ui/Button';
import { Hand, Loader2 } from 'lucide-react';
import { useModal } from '@/shared/lib/hooks/useModal';

const ActiveSessions = () => {
    const { sessions, isLoading, isTerminating, handleTerimanteSessions, handleDropSession } = useActiveSessions();
    const { openModal, closeModal } = useModal();

    if (isLoading) return <ActiveSessionsSkeleton />;

    const onConfirm = () => {
        closeModal();
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
                                    openModal({
                                        withHeader: false,
                                        bodyClassName: 'max-w-[350px] p-5 h-auto',
                                        id: 'terminateSessions-confirm-modal',
                                        content: (
                                            <Confirm
                                                text='Are you sure you want to terminate all other sessions?'
                                                onCancel={() => closeModal()}
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

export default ActiveSessions;