import React from 'react';
import { SettingsContext } from '../contexts/context';

export const useSettings = () => React.useContext(SettingsContext)