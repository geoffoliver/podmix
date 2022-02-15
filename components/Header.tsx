import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import { Button, Container, Navbar } from 'react-bootstrap';

const Header = () => {
  const { data: session } = useSession()

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand href="/">Podlists</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          {session
            ? (
              <>
                <Link href="/build">
                  <a>
                    {session.user.name || session.user.email}
                  </a>
                </Link>
                <Button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
            <Button type="button" onClick={() => signIn()}>Login</Button>
            )
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default Header;
