/* eslint-disable @next/next/no-img-element */
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import Icon from '@/components/Icon';

import styles from '@/styles/PlaylistPlayer.module.scss';
import { secondsToDuration } from '@/lib/util';
import PlaylistDetailContext from '@/lib/context/playlistDetail';
import classNames from 'classnames';
import { Truncate } from './ui/Truncate';

const PlaylistPlayer = () => {
  const [loading, setLoading] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [mounted, setMounted] = useState(false);
  const player = useRef<HTMLAudioElement>(null);
  const context = useContext(PlaylistDetailContext);

  const {
    playlist,
    playIndex,
    setPlayIndex,
    playing,
    setPlaying,
    duration,
    setDuration,
    progress,
    setProgress,
    volume,
    setVolume,
    forcePlay,
    setForcePlay,
  } = context;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!playlist || !playlist.items || playlist.items.length === 0) {
      setPlayIndex(-1);
    }

    setPlayIndex(0);
  }, [playlist, setPlayIndex]);

  useEffect(() => {
    if (playing && player.current && player.current.paused) {
      player.current.play();
    } else if (!playing && player.current && !player.current.paused) {
      player.current.pause();
    }
  }, [playing]);

  const current = useMemo(() => {
    if (playIndex > -1 && playlist && playlist.items && playlist.items.length > 0) {
      return playlist.items[playIndex];
    }

    return null;
  }, [playIndex, playlist]);

  const maxIndex = useMemo(() => {
    if (playlist && playlist.items) {
      return playlist.items.length - 1;
    }

    return 0;
  }, [playlist]);

  const volumeIcon = useMemo(() => {
    if (volume === 0) {
      return 'volume-xmark';
    }

    return 'volume-high';
  }, [volume]);

  const handleCanPlay = useCallback(() => {
    setVolume(player.current.volume);
    setLoading(false);
    setCanPlay(true);

    if (forcePlay) {
      player.current.play();
      setForcePlay(false);
    }
  }, [forcePlay, setForcePlay, setVolume]);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setCanPlay(false);
  }, []);

  const handleProgressChange = useCallback(() => {
    setProgress(player.current.currentTime);
  }, [setProgress]);

  const handlePause = useCallback(() => {
    if (player.current.seeking) {
      return;
    }
    if (player.current.ended) {
      return;
    }
    setPlaying(false);
  }, [setPlaying]);

  const handlePlay = useCallback(() => {
    if (player.current.seeking) {
      return;
    }
    setPlaying(true);
  }, [setPlaying]);

  const handleVolumeChange = useCallback(() => {
    setVolume(player.current.volume);
  }, [setVolume]);

  const handleDurationChange = useCallback(() => {
    setDuration(player.current.duration);
  }, [setDuration]);

  const handleEnded = useCallback(() => {
    if (player.current.seeking) {
      return;
    }

    const nextIndex = playIndex + 1;
    if (nextIndex >= playlist.items.length) {
      setPlaying(false);
      return;
    }

    setPlayIndex(nextIndex);
    setForcePlay(true);

    player.current.load();
  }, [playIndex, playlist, setForcePlay, setPlayIndex, setPlaying]);

  const changeVolume = useCallback((e) => {
    setVolume(e.target.value);
    player.current.volume = e.target.value;
  }, [setVolume]);

  const changeProgress = useCallback((e) => {
    player.current.currentTime = e.target.value;
  }, []);

  const togglePlayback = useCallback(() => {
    if (player.current.paused) {
      player.current.play();
    } else {
      player.current.pause();
    }
    setPlaying(!player.current.paused);
  }, [setPlaying]);

  const toggleMute = useCallback(() => {
    player.current.volume = player.current.volume ? 0 : 1;
  }, []);

  const prev = useCallback(() => {
    setPlayIndex(playIndex - 1);
    try {
      if (playing) {
        setForcePlay(true);
      }

      player.current.load();
    } catch (ex) {
      console.error(ex);
    }
  }, [playIndex, playing, setForcePlay, setPlayIndex]);

  const next = useCallback(() => {
    setPlayIndex(playIndex + 1);
    try {
      if (playing) {
        setForcePlay(true);
      }

      player.current.load();
    } catch (ex) {
      console.error(ex);
    }
  }, [playIndex, playing, setForcePlay, setPlayIndex]);

  return (
    <>
      <div className={styles.player}>
        <Row>
          <Col sm={4} md={3} lg={2} className={styles.image}>
            <img src={current?.image} alt={`Image for ${current?.title}`} className="img-fluid" />
            <div className={styles.mobileTitle}>
              <h5>
                <Truncate lines={1}>
                  {current?.title}
                </Truncate>
                <div className={styles.showName}>
                  <Truncate lines={1}>
                    {current?.artist}
                  </Truncate>
                </div>
              </h5>
              <div className={styles.times}>
                {secondsToDuration(progress)} / {secondsToDuration(duration)}
              </div>
            </div>
          </Col>
          <Col sm={8} md={9} lg={10}>
            <div className={styles.title}>
              <h5>
                <Truncate lines={1}>
                  {current?.title}
                </Truncate>
                <div className={styles.showName}>
                  <Truncate lines={1}>
                    {current?.artist}
                  </Truncate>
                </div>
              </h5>
              <div className={styles.times}>
                {secondsToDuration(progress)} / {secondsToDuration(duration)}
              </div>
            </div>
            <div className={styles.controls}>
              <div className={styles.buttons}>
                <Button
                  type="button"
                  title="Previous"
                  variant="dark"
                  onClick={prev}
                  disabled={!canPlay || playIndex === 0}
                >
                  <Icon
                    fixedWidth
                    icon="backward-step"
                  />
                </Button>
                <Button
                  type="button"
                  variant="dark"
                  onClick={togglePlayback}
                  title={playing ? 'Play' : 'Pause'}
                  disabled={!canPlay}
                  className={styles.playButton}
                >
                  <Icon
                    fixedWidth
                    spin={loading}
                    size="2x"
                    icon={
                      loading ? 'spinner' : (playing ? 'pause' : 'play')
                    }
                  />
                </Button>
                <Button
                  type="button"
                  variant="dark"
                  title="Next"
                  onClick={next}
                  disabled={!canPlay || playIndex === maxIndex}
                >
                  <Icon
                    fixedWidth
                    icon="forward-step"
                  />
                </Button>
              </div>
              <div className={styles.progress}>
                <input type="range" value={progress} onChange={changeProgress} min={0} max={duration} step={1} />
              </div>
              <div className={styles.volume}>
                <Button variant="link" className="p-0" onClick={toggleMute} title={volume ? 'Mute' : 'Unmute'}>
                  <Icon
                    icon={volumeIcon}
                    fixedWidth
                  />
                </Button>
                <input type="range" value={volume} onChange={changeVolume} min={0} max={1} step={0.01} />
              </div>
            </div>
            {current?.description && (
              <div className={styles.descriptionContainer}>
                <div className={classNames(styles.description, { [styles.expanded]: showFullDescription })}>
                  <Truncate lines={(showFullDescription || !mounted) ? -1 : 1}>
                    {current?.description}
                  </Truncate>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  <Icon
                    icon={showFullDescription ? 'chevron-up' : 'chevron-down'}
                    className="me-2"
                    fixedWidth
                  />
                  {showFullDescription ? 'Hide' : 'Show More'}
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </div>
      {current && (
        <div className={styles.actualPlayer}>
          <audio
            controls
            ref={player}
            onLoadStart={handleLoadStart}
            onCanPlay={handleCanPlay}
            onTimeUpdate={handleProgressChange}
            onPause={handlePause}
            onPlay={handlePlay}
            onVolumeChange={handleVolumeChange}
            onDurationChange={handleDurationChange}
            onEnded={handleEnded}
            key={current.url}
          >
            <source
              src={current.url}
            />
          </audio>
        </div>
      )}
    </>
  );
};

export default PlaylistPlayer;
