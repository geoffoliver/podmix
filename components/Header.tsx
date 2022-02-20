import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

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
          {session
            ? (
              <>
                <Nav>
                  <Nav.Link href="/build">
                    {session.user.name || session.user.email}
                  </Nav.Link>
                </Nav>
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
