import { Header } from "@/components/header"
import Footer from "@/components/Footer";;
import CategoryBar from "@/components/CategoryBar";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import AuthProvider from "@/components/AuthProvider";
import ReduxProvider from "@/components/ReduxProvider";
import AuthStateBridge from "@/components/AuthStateBridge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ReduxProvider>
        <ReactQueryProvider>
          <AuthStateBridge />
          <div className="">
            <Header />
            <CategoryBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ReactQueryProvider>
      </ReduxProvider>
    </AuthProvider>
  );
}
