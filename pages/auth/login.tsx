/* eslint-disable @next/next/no-img-element */
import { useState, useMemo, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { SignInErrorTypes } from 'next-auth/core/pages/signin';
import { ClientSafeProvider, getCsrfToken, getProviders, LiteralUnion, signIn, useSession } from 'next-auth/react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { BuiltInProviderType } from 'next-auth/providers';
import { useRouter } from 'next/router';

import styles from '@/styles/login.module.scss';
import Icon from '@/components/Icon';
import Head from '@/components/Head';

const errors: Record<SignInErrorTypes, string> = {
  Signin: 'Try signing in in with a different account.',
  OAuthSignin: 'Try signing in in with a different account.',
  OAuthCallback: 'Try signing in in with a different account.',
  OAuthCreateAccount: 'Try signing in in with a different account.',
  EmailCreateAccount: 'Try signing in in with a different account.',
  Callback: 'Try signing in in with a different account.',
  OAuthAccountNotLinked: 'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'The e-mail could not be sent.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
  default: 'Unable to sign in.',
};

type LoginProps = {
  csrfToken: string;
  error: string;
  callbackUrl: string;
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
}

// copied from next-auth source and tweaked
export default function Login(props: LoginProps) {
  const {
    csrfToken,
    providers,
    error: errorType,
  } = props;

  const session = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.replace('/');
    }
  }, [router, session]);

  const error = useMemo(() => {
    return errorType && (errors[errorType] ?? errors.default);
  } , [errorType]);

  return (
    <>
      <Head title="Sign in" />
      <Container>
        <Row>
          <Col md={{ offset: 3, span: 6 }} className="pt-4">
            <h1>Sign In / Register</h1>
            <p>
              If you&apos;re registering a new account, enter your email address and we&apos;ll
              send you a link to sign in. Alternatively, use one of the external accounts we support.
            </p>
            {error && (
              <Alert variant="danger">
                <Alert.Heading>
                  Error!
                </Alert.Heading>
                <p className="mb-0">{error}</p>
              </Alert>
            )}
            <div className={styles.login}>
              <Row>
                <Col sm={6}>
                  <form action={providers.email.signinUrl} method="POST">
                    <input type="hidden" name="csrfToken" value={csrfToken} />
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        autoFocus
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                      />
                    </Form.Group>
                    <div className="d-grid">
                      <Button variant="primary" type="submit">Sign in with Email</Button>
                    </div>
                    <div className="text-center small text-muted pt-4">
                      We&apos;ll send you a link to sign in - no password!
                    </div>
                  </form>
                </Col>
                <Col sm={6}>
                  <Form.Label>External Accounts</Form.Label>
                  <div className="mb-3">
                    <Button
                      variant="outline-primary"
                      onClick={() => signIn('facebook', {
                        callbackUrl: '/',
                      })}
                    >
                      <Icon icon={['fab', 'facebook']} className="me-2" fixedWidth />
                      Sign in with Facebook
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="outline-primary"
                      className={styles.loginButton}
                      onClick={() => signIn('google', {
                        callbackUrl: '/',
                      })}
                    >
                      <img
                        src="/google-logo.svg"
                        alt="Sign In with Google"
                        className={styles.googleIcon}
                      />
                      Sign in with Google
                    </Button>
                  </div>
                  <div className="text-center small text-muted pt-4">
                    Use an external account to sign in.
                  </div>
                </Col>
              </Row>
              <Alert variant="info" className="mt-4">
                <Alert.Heading as="h5">Why should I create an account?</Alert.Heading>
                <p className="m-0">
                  An account allows you to create your own playlists and save your favorite playlists.
                </p>
              </Alert>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: {
      csrfToken,
      providers,
      callbackUrl: context.query?.callbackUrl || null,
      error: context.query?.error || null,
    },
  };
};
