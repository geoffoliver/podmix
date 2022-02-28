import { useState, useEffect, useCallback } from "react";
import { SessionProvider } from 'next-auth/react';
import { InstantSearch } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import qs from 'qs';

import AppContext from '@/lib/context/app';
import Header from '@/components/Header';
import ForceProfileSetup from '@/components/ForceProfileSetup';

import { useRouter } from "next/router";
import { Col, Container, Row } from "react-bootstrap";
import styles from '@/styles/app.module.scss';

import 'instantsearch.css/themes/algolia-min.css';
import '@/styles/globals.scss'


const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

const createURL = (state: any) => `?${qs.stringify(state)}`;

function MyApp({
  Component, pageProps: { session, ...pageProps }
}) {
  const router = useRouter();
  const query = router.asPath.includes('?') ? router.asPath.split('?').pop() : '';
  const [search, setSearch] = useState(qs.parse(query));

  const submitSearch = useCallback((e) => {
    router.push(`/search${createURL({ query: e.target.value, page: 1 })}`);
  }, [router]);

  const handleSearchStateChange = useCallback((searchState) => {
    if (router.pathname !== '/search') {
      return;
    }

    if (searchState.refinementList) {
      const keys = Object.keys(searchState.refinementList);
      keys.forEach((key) => {
        if (!searchState.refinementList[key]) {
          delete searchState.refinementList[key];
        }
      });
    }

    setSearch(searchState);
    router.push(`/search${createURL(searchState)}`)
  }, [router]);

  useEffect(() => {
    document.addEventListener('search', submitSearch);

    return () => {
      document.removeEventListener('search', submitSearch);
    };
  }, [submitSearch]);

  useEffect(() => {
    setSearch(qs.parse(qs.stringify(router.query)));
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
          onSearchStateChange={handleSearchStateChange}
          createURL={createURL}
        >
          <ForceProfileSetup />
          <Header />
          <Component {...pageProps} />
        </InstantSearch>
      </AppContext.Provider>
      <div className={styles.footer}>
        <Container>
          <Row>
            <Col>
              &copy; {new Date().getFullYear()} Podmix
            </Col>
          </Row>
        </Container>
      </div>
    </SessionProvider>
  );
}

export default MyApp
