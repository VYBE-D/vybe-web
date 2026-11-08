import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { SiteFeaturesProvider } from "../context/SiteFeaturesContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>
          <SiteFeaturesProvider>{children}</SiteFeaturesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
