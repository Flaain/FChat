import React from 'react';
import { SocketContext } from '../providers/socket/context';

export const useSocket = () => React.useContext(SocketContext);