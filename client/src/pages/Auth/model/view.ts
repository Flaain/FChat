import React from 'react';

export const View = React.lazy(() => import('../ui/ui').then((module) => ({ default: module.Auth })));