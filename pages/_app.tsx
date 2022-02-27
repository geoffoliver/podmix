import { useState, useRef, useEffect } from "react";
import { SessionProvider } from 'next-auth/react';
import { InstantSearch } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import qs from 'qs';

import AppContext from '@/lib/context/app';
import Header from '@/components/Header';
import ForceProfileSetup from '@/components/ForceProfileSetup';

import '../styles/globals.scss'
import 'instantsearch.css/themes/algolia-min.css';
import { useRouter } from "next/router";

const DEBOUNCE_TIME = 400;

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

const createURL = (state: any) => `?${qs.stringify(state)}`;

const searchStateToUrl = (searchState: any) => {
  if (searchState) {
    return `/search${createURL(searchState)}`;
  }

  return '/search';
};

function MyApp({
  Component, pageProps: { session, ...pageProps }
}) {
  const router = useRouter();
  const [search, setSearch] = useState(router.query);
  const debouncedSetStateRef = useRef(null);

  function onSearchStateChange(updatedSearchState: any) {
    clearTimeout(debouncedSetStateRef.current);

    debouncedSetStateRef.current = setTimeout(() => {
      router.push(searchStateToUrl(updatedSearchState));
    }, DEBOUNCE_TIME);

    setSearch(updatedSearchState);
  }

  useEffect(() => {
    setSearch(router.query);
  }, [router.query]);

  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <AppContext.Provider value={{
        search,
        setSearch,
      }}>
        <InstantSearch
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
          searchClient={searchClient}
          searchState={search}
          onSearchStateChange={onSearchStateChange}
          createURL={createURL}
        >
          <ForceProfileSetup />
          <Header />
          <Component {...pageProps} />
        </InstantSearch>
      </AppContext.Provider>
    </SessionProvider>
  );
}

export default MyApp
