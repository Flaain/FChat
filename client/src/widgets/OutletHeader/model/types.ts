import React from 'react';

export interface OutletHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    description?: string;
    isOfficial?: boolean;
    dropdownMenu?: React.ReactNode;
}