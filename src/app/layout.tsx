import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
// import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="bn" className="h-full">
            <body
                className="min-h-full flex flex-col font-sans bg-[#f4f6f4]"
                suppressHydrationWarning
            >
                <Suspense fallback={<div className="h-16 bg-white border-b" />}>
                    <Navbar />
                </Suspense>
                <Ticker />
                <main className="grow">{children}</main>
                {/* <Footer /> */}
                <ToastContainer position="bottom-right" autoClose={3000} />
            </body>
        </html>
    );
}
