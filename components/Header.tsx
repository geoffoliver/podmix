/* eslint-disable @next/next/no-img-element */
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

import styles from './Header.module.scss';
import Icon from "./Icon";

const Header = () => {
  const { data: session } = useSession()

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand href="/">Podlists</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            {session
              ? (
                <>
                  <Link href="/build" passHref>
                    <Nav.Link href="/build">
                      Build Playlist
                    </Nav.Link>
                  </Link>
                  <Link href="/profile" passHref>
                    <Nav.Link href="/profile" className={styles.userIcon}>
                      {session.user.image && (
                        <img
                          src={session.user.image}
                          className={styles.userIcon}
                          alt={session.user.name || session.user.email}
                        />
                      )}
                    </Nav.Link>
                  </Link>
                  <Nav.Link onClick={() => signOut({ callbackUrl: '/' })} title="Logout">
                    <Icon icon="sign-out" />
                  </Nav.Link>
                </>
              ) : (
              <Button type="button" variant="success" onClick={() => signIn()}>Login</Button>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default Header;
