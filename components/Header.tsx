/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import {
  useSession,
  signIn,
  signOut,
} from 'next-auth/react'
import {
  Button,
  Container,
  Nav,
  Navbar,
} from 'react-bootstrap';
import {
  InstantSearch,
  Hits,
  SearchBox,
} from 'react-instantsearch-dom';
import Link from 'next/link';
import algoliasearch from 'algoliasearch/lite';

import styles from './Header.module.scss';
import Icon from './Icon';

import 'instantsearch.css/themes/algolia-min.css';

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

const Header = () => {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Navbar variant="dark" expand="lg" className={styles.navbar}>
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand href="/"><Icon icon="shuffle" fixedWidth /> Podmix</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <div className={styles.search}>
          <InstantSearch indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME} searchClient={searchClient}>
            <SearchBox
              translations={{
                placeholder: 'Search for playlists and podcasts',
              }}
            />
            <Hits />
          </InstantSearch>
        </div>
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            {session
              ? (
                <>
                  <Link href="/build" passHref>
                    <Nav.Link href="/build">
                      My Playlists
                    </Nav.Link>
                  </Link>
                  <Link href="/profile" passHref>
                    <Nav.Link href="/profile" className={styles.userIcon}>
                      <img
                        src={session.user.image || '/default-user-image.png'}
                        className={styles.userIcon}
                        alt={session.user.name || session.user.email}
                      />
                    </Nav.Link>
                  </Link>
                  <Nav.Link onClick={() => signOut({ callbackUrl: '/' })} title="Logout">
                    <Icon icon="sign-out" />
                  </Nav.Link>
                </>
              ) : (
              <Button type="button" variant="primary" onClick={() => signIn()}>Login</Button>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default Header;
