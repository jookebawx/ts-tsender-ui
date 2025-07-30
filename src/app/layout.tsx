import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import SafeProviders from './SafeProvider';
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "TSender"
};

export default function RootLayout(props: {children:ReactNode}) {
  return (
    <html lang="en">
      <body>
        <SafeProviders>
          <Header />
          {props.children}
        </SafeProviders>
      </body>
    </html>
  );
}
