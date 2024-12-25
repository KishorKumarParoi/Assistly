import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Avatar from "./Avatar";
const Header = () => {
  return (
    <header className="bg-white shadow-sm text-gray-800 flex justify-between p-5">
      <Link href="/" className="flex items-center text-4xl font-thin ">
        {/* Avatar */}
        <Avatar seed="Assistly AI Support Agent" />
        <div className="ml-3">
          <h1>Assistly</h1>
          <h2 className="text-sm">Your Customizable Own AI Agent</h2>
        </div>
      </Link>

      <div>
        <SignedIn>
          <UserButton showName />
        </SignedIn>

        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
