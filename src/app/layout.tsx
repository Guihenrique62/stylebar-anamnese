import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Work_Sans } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Stylebar | Ficha de Anamnese",
    template: "%s | Stylebar Anamnese",
  },
  description:
    "Preenchimento e consulta de fichas de anamnese das clientes Stylebar.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#2f2f2f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${bodoni.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
