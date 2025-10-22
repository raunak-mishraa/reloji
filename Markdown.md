<!-- https://chatgpt.com/c/68e134ab-585c-8321-8ee2-52035a75aed0 -->
<!-- import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    return (
      <div>
        <h1>Welcome, {session.user?.name}</h1>
        <p>This is a protected page.</p>
      </div>
    );
  }

  return null;
} -->

card of different categories
https://pusher.com/ 
Create a new Channels app: In your Pusher dashboard, create a new "Channels" app.
Get your credentials: Once the app is created, go to the "App Keys" section to find your credentials.
Add to .env: Copy the credentials and add them to your .env file at the root of your project: