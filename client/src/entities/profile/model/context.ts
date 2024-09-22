import React from 'react';
import { IProfileContext } from './types';

export const ProfileContext = React.createContext<IProfileContext>({
    profile: null!,
    isUploadingAvatar: false,
    handleUploadAvatar: async () => {}
});

export const useProfile = () => React.useContext(ProfileContext);