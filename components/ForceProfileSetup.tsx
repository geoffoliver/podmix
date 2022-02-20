import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const ForceProfileSetup = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (
    router.pathname !== '/profile'
    && session
    && session.user
    && !session.user.name
    && !session.user.image
  ) {
    router.push('/profile');
  }

  return null;
};

export default ForceProfileSetup;
