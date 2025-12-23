'use client';

import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "../utils/getTokens";

export default function BaseRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex w-full justify-center items-center bg-bg-main h-screen">
            {children}
        </div>
    );
}