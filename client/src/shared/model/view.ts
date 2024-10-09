import React from "react";

export const EmojiPicker = React.lazy(() => import('../ui/EmojiPicker').then((module) => ({ default: module.EmojiPicker })));