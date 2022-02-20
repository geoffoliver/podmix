/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import useSWR from 'swr';

import styles from '@/styles/profile.module.scss';
import Icon from '@/components/Icon';

const Profile = () => {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(session?.user);
  // console.log(session);
  // const user = useSWR('');

  const saveProfile = useCallback((e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 3000);
  }, []);

  const updateValue = useCallback((e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  }, [profile]);

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Edit Profile - Podlists</title>
      </Head>
      <Container className="mt-3">
        <Row>
          <Col>
            <div className={styles.profile}>
              <Form onSubmit={saveProfile} className={styles.form}>
              <h3>Edit Profile</h3>
                <div className={styles.picture}>
                  <button type="button" title="Change Profile Image">
                    <img src={profile.image} alt="Profile Image"/>
                    <div>
                      <Icon icon="camera" size="2x" />
                      Change Picture
                    </div>
                  </button>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Display Name<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={profile.name || ''}
                    onChange={updateValue}
                    required
                  />
                  <Form.Text>
                    This is displayed on the site with playlists you have created.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Email Address<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profile.email || ''}
                    onChange={updateValue}
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
