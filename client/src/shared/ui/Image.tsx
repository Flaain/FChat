import React from "react";
import { cn } from "../lib/utils/cn";
import { ImageProps } from "../model/types";

export const Image = ({ skeleton, className, ...rest }: ImageProps) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [error, setError] = React.useState(false);

    return (
        <>
            {!imageLoaded && skeleton}
            {!error && (
                <img
                    {...rest}
                    className={cn(className, error && "hidden")}
                    style={imageLoaded ? {}: {
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        // clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        borderWidth: 0,
                        opacity: 0,
                        position: "absolute",
                    }}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setError(true)}
                />
            )}
        </>
    );
};