import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import Link from "next/link";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Cursor } from "./cursor";
import { SmoothScroll } from "./smooth-scroll";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Nicco Torelli",
  description:
    "Styling by Nicco Torelli, London based stylist, writer and fashion editor, and editor in chief of DUST.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

const INTRO_SCRIPT = `try{if(location.pathname==="/"&&!sessionStorage.getItem("nt-intro")){var d=document.documentElement;d.classList.add("intro");sessionStorage.setItem("nt-intro","1");setTimeout(function(){d.classList.remove("intro")},2800)}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      id="top"
      className={hostGrotesk.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <SmoothScroll />
        <Cursor />
        <a className="skip" href="#content">
          Skip to content
        </a>
        <header className="bar masthead">
          <Link href="/">Nicco Torelli</Link>
          <nav aria-label="Main">
            <Link href="/">Index</Link>
            <Link href="/info">Info</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
