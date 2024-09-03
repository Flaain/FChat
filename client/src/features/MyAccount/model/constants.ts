export const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
export const MAX_STATUS_SIZE = 70;
export const STOP_SIZE = 200;
export const MAX_IMAGE_SIZE = 5 * 1024 ** 2;

export const imageValidators: Array<{ isValid: (file: File) => boolean; message: string }> = [
    {
        isValid: (file) => validFileTypes.includes(file.type),
        message: "Sorry, FCHAT can't process that type of image"
    },
    {
        isValid: (file) => !file.size || file.size <= MAX_IMAGE_SIZE,
        message: "Sorry, FCHAT can't process that size of image"
    }
];