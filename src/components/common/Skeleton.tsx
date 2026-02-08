import React from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
    return (
        <div
            className={twMerge("animate-pulse bg-neutral-800 rounded-md", className)}
            {...props}
        />
    );
};

export default Skeleton;
