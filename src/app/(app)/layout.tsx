import { Header } from "@/components/header"
import Footer from "@/components/Footer";;
import CategoryBar from "@/components/CategoryBar";
import ReactQueryProvider from "@/components/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <div className="">
        <Header />
        <CategoryBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ReactQueryProvider>
  );
}
