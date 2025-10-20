import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-md">
        <Link
          className="focus-visible:ring-ring mb-8 flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          href="/"
        >
          <Image
            className="h-10 w-auto dark:invert"
            src="/assets/images/logo.png"
            alt="Reloji Logo"
            width={150}
            height={50}
          />
          <span className="sr-only">Reloji</span>
        </Link>
        {children}
      </div>
    </main>
  );
}
