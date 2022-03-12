/* eslint-disable @next/next/no-img-element */
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import {
  useSession,
  signIn,
  signOut,
} from 'next-auth/react';
import {
  Button,
  Container,
  Nav,
  Navbar,
} from 'react-bootstrap';
import { SearchBox } from 'react-instantsearch-dom';
import Link from 'next/link';

import styles from '@/styles/Header.module.scss';
import Icon from './Icon';
import { useRouter } from 'next/router';

// const DEBOUNCE_TIME = 400;

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  // const timeout = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = useCallback((e: SyntheticEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    const searchField = Array.from(e.currentTarget.elements).find((el: HTMLInputElement) => el.type === 'search');
    if (!searchField) {
      return;
    }
    searchField.dispatchEvent(new Event('search', {
      bubbles: true,
      composed: true,
    }));
  }, []);

  /*
  const autoSubmit = useCallback((e: SyntheticEvent<HTMLInputElement, Event>) => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      e.target.dispatchEvent(new Event('search', {
        bubbles: true,
        composed: true,
      }));
    }, DEBOUNCE_TIME);
  }, []);
  */

  if (!mounted) {
    return null;
  }

  return (
    <Navbar variant="dark" expand="lg" className={styles.navbar}>
      <Container>
        <div className={styles.topNav}>
          <Link href="/" passHref>
            <Navbar.Brand href="/">
              <Icon icon="shuffle" fixedWidth />
              <span className={styles.name}>Podmix</span>
            </Navbar.Brand>
          </Link>
          <div className={styles.search}>
            <SearchBox
              searchAsYouType={false}
              onSubmit={handleSubmit}
              // onChange={autoSubmit}
              translations={{
                placeholder: 'Search playlists, podcasts, and episodes',
              }}
            />
          </div>
          <Navbar.Toggle aria-controls="navbar-nav" />
        </div>
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Link href="/help" passHref>
              <Nav.Link active={router.pathname === '/help'}>
                Help
              </Nav.Link>
            </Link>
            {session
              ? (
                <>
                  <Link href="/favorites" passHref>
                    <Nav.Link active={router.pathname === '/favorites'}>
                      Favorites
                    </Nav.Link>
                  </Link>
                  <Link href="/build" passHref>
                    <Nav.Link active={router.pathname === '/build'}>
                      Playlists
                    </Nav.Link>
                  </Link>
                  <Link href="/profile" passHref>
                    <Nav.Link className={styles.profileLink} title="Profile" active={router.pathname === '/profile'}>
                      <img
                        src={session.user.image || '/default-user-image.png'}
                        className={styles.userIcon}
                        alt={`${session.user.name || session.user.email} user image`}
                      />
                      <div className={styles.userName}>Profile</div>
                    </Nav.Link>
                  </Link>
                  <Nav.Link onClick={() => signOut({ callbackUrl: '/' })} title="Logout">
                    <Icon icon="sign-out" className={styles.logoutIcon} />
                    <div className={styles.logout}>Logout</div>
                  </Nav.Link>
                </>
              ) : (
              <Button
                type="button"
                variant="primary"
                onClick={() => signIn()}
                className={styles.login}
              >
                Sign In/Register
              </Button>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
