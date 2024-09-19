import React from 'react';

export const LayoutSheetView = React.lazy(() => import('../ui/ui').then((module) => ({ default: module.LayoutSheet })));