import { SessionProvider } from "next-auth/react"

import Header from "@/components/Header";
import ForceProfileSetup from "@/components/ForceProfileSetup";

import '../styles/globals.scss'

function MyApp({
  Component, pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ForceProfileSetup />
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp
