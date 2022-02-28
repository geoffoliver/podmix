import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

import PlaylistItem from '@/lib/models/playlistItem';
import Playlist from '@/lib/models/playlist';
import Icon from '@/components/Icon';

import styles from '@/styles/PlaylistPlayer.module.scss';
import { secondsToDuration } from '@/lib/util';

type PlaylistProps = {
  playlist: Playlist;
  onPlay: (item: PlaylistItem) => any;
  play: number;
};

const PlaylistPlayer = ({ playlist, onPlay, play }: PlaylistProps) => {
  const [loading, setLoading] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [forcePlay, setForcePlay] = useState(false);
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!playlist || !playlist.items || playlist.items.length === 0) {
      setPlayIndex(-1);
    }

    setPlayIndex(0);
  }, [playlist]);

  useEffect(() => {
    onPlay(playlist.items[playIndex] || null);
  }, [playlist, playIndex, onPlay]);

  useEffect(() => {
    if (!player.current) {
      return;
    }
    setPlayIndex(play);
    if (play > -1) {
      try {
        player.current.load();
        if (playing) {
          player.current.play();
        }
      } catch (ex) {
        console.log(ex);
      }
    }
  }, [play, playing]);

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

    return 'volume-high'
  }, [volume]);

  const handleCanPlay = useCallback((e) => {
    setVolume(player.current.volume);
    setLoading(false);
    setCanPlay(true);

    if (forcePlay) {
      player.current.play();
      setForcePlay(false);
    }
  }, [forcePlay]);

  const handleLoadStart = useCallback((e) => {
    setLoading(true);
    setCanPlay(false);
  }, []);

  const handleProgressChange = useCallback((e) => {
    setProgress(player.current.currentTime);
  }, []);

  const handlePause = useCallback((e) => {
    if (player.current.seeking) {
      return;
    }
    if (player.current.ended) {
      return;
    }
    setPlaying(false);
  }, []);

  const handlePlay = useCallback(() => {
    if (player.current.seeking) {
      return;
    }
    setPlaying(true);
  }, []);

  const handleVolumeChange = useCallback(() => {
    setVolume(player.current.volume);
  }, []);

  const handleDurationChange = useCallback(() => {
    setDuration(player.current.duration);
  }, []);

  const handleEnded = useCallback((e) => {
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
  }, [playIndex, playlist.items.length]);

  const changeVolume = useCallback((e) => {
    setVolume(e.target.value);
    player.current.volume = e.target.value;
  }, []);

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
  }, []);

  const toggleMute = useCallback(() => {
    player.current.volume = player.current.volume ? 0 : 1;
  }, []);

  const prev = useCallback(() => {
    setPlayIndex(playIndex - 1);
    try {
      player.current.load();
      if (playing) {
        player.current.play();
      }
    } catch (ex) {
      console.log(ex);
    }
  }, [playIndex, playing]);

  const next = useCallback((forcePlay = false) => {
    const nextIndex = playIndex + 1;

    setPlayIndex(nextIndex);

    try {
      if (playing || forcePlay) {
        setForcePlay(true);
      }

      player.current.load();
    } catch (ex) {
      console.log(ex);
    }
  }, [playIndex, playing]);

  return (
    <>
    <div className={styles.player}>
      <div className={styles.title}>
        <h5>{current?.title}</h5>
        <div className={styles.times}>
          {secondsToDuration(progress)} / {secondsToDuration(duration)}
        </div>
      </div>
      <div className={styles.controls}>
        <div className={styles.buttons}>
          <ButtonGroup>
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
            >
              <Icon
                fixedWidth
                spin={loading}
                icon={
                  loading ? 'spinner' : (playing ? 'pause' : 'play')
                }
              />
            </Button>
            <Button
              type="button"
              variant="dark"
              title="Next"
              onClick={() => next(false)}
              disabled={!canPlay || playIndex === maxIndex}
            >
              <Icon
                fixedWidth
                icon="forward-step"
              />
            </Button>
          </ButtonGroup>
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
        >
          <source
            src={current.url}
          />
        </audio>
      </div>
    )}
    </>
  )
};

export default PlaylistPlayer;
