import React from 'react';

export interface OutletHeaderProps {
    name: string;
    description?: string;
    isOfficial?: boolean;
    dropdownMenu?: React.ReactNode;
}