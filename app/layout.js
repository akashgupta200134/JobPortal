import "./globals.css";
import { Inter, Playfair_Display , Space_Grotesk } from "next/font/google";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";


const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});


export const metadata = {
  title: "JOb Portal",
  description: "Created By Akash",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className}`} suppressHydrationWarning>
        <div className={spaceGrotesk.className}>
      <Navbar/>
        {children}
        <Footer/>
        </div>
  
      </body>
    </html>
  );
}
