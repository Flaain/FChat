import React from "react";

export const EmojiPicker = React.lazy(() => import('../ui/EmojiPicker').then((module) => ({ default: module.EmojiPicker })));
export const Layout = React.lazy(() => import('../ui/Layout').then((module) => ({ default: module.Layout })));