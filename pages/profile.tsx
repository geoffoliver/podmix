/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { DashboardModal } from '@uppy/react';
import { DefaultSession } from 'next-auth';
import { useRouter } from 'next/router';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import Webcam from '@uppy/webcam';
import ImageEditor from '@uppy/image-editor';
import axios from 'axios';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/image-editor/dist/style.css';
import '@uppy/webcam/dist/style.css';

import Icon from '@/components/Icon';
import Head from '@/components/Head';

import styles from '@/styles/profile.module.scss';

type UserProfile = DefaultSession['user'] & {
  id: string
};

const Profile = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/');
    },
  });

  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (profile) {
      return;
    }

    if (!session || !session.user) {
      return;
    }

    setProfile(session.user);
  }, [session, profile]);

  const saveProfile = useCallback(async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.post('/api/users/save-profile', profile);
      router.reload();
    }catch (ex) {
      alert(ex.message || 'An error occurred saving your profile');
    } finally {
      setSaving(false);
    }
  }, [profile, router]);

  const updateValue = useCallback((e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  }, [profile]);

  const uppy = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const up = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    });

    up.use(XHRUpload, {
      endpoint: '/api/users/upload-profile-picture',
    });

    up.use(Webcam, {
      modes: ['picture'],
    });

    up.use(ImageEditor, {
      id: 'ImageEditor',
      cropperOptions: {
        aspectRatio: 1,
        croppedCanvasOptions: {},
      },
      actions: {
        revert: true,
        rotate: true,
        granularRotate: true,
        flip: true,
        zoomIn: true,
        zoomOut: true,
        cropSquare: false,
        cropWidescreen: false,
        cropWidescreenVertical: false,
      },
    });

    up.on('upload-success', (result, response) => {
      updateValue({
        target: {
          name: 'image',
          value: response.body.url,
        },
      });
      setShowUpload(false);
    });
    return up;
  }, [updateValue]);

  return (
    <>
      <Head title="Edit Profile" />
      <Container className="mt-3">
        <Row>
          <Col>
            <div className={styles.profile}>
              <h3>Edit Profile</h3>
              <Form onSubmit={saveProfile}>
                <div className={styles.form}>
                  <div className={styles.picture}>
                    <button type="button" title="Change Profile Image" onClick={() => setShowUpload(true)}>
                      <img src={profile?.image || '/default-user-image.png'} alt="Profile Image"/>
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
                      value={profile?.name || ''}
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
                      value={profile?.email || ''}
                      onChange={updateValue}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="text-end">
                  <Button
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
        {uppy && <DashboardModal
          uppy={uppy}
          open={showUpload}
          onRequestClose={() => setShowUpload(false)}
          plugins={['Webcam', 'ImageEditor']}
          autoOpenFileEditor
        />}
      </Container>
    </>
  );
};

export default Profile;
