import Typography from "./Typography";
import { ConfirmationProps } from "../model/types";
import { Button } from "./Button";

const Confirmation = ({
    text,
    onConfirm,
    onCancel,
    controlsDisabled,
    onCancelText = "Cancel",
    onConfirmText = "Confirm",
}: ConfirmationProps) => {
    return (
        <div className='flex flex-col gap-5 items-start'>
            <Typography as='p' variant='primary'>
                {text}
            </Typography>
            <div className='flex justify-center gap-5 mt-5'>
                <Button onClick={onCancel} variant='secondary' disabled={controlsDisabled}>
                    {onCancelText}
                </Button>
                <Button onClick={onConfirm} variant='default' disabled={controlsDisabled}>
                    {onConfirmText}
                </Button>
            </div>
        </div>
    );
};

export default Confirmation;