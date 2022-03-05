/* eslint-disable @next/next/no-img-element */
import { useMemo } from 'react';
import { DragPreviewImage, useDrag } from 'react-dnd';

import { ItemWithiTunes, PODCAST_EPISODE } from '@/lib/types/podcast';
import { durationToSeconds, secondsToDuration } from '@/lib/util';

import styles from '@/styles/Episode.module.scss';
import { Truncate } from './ui/Truncate';

export type EpisodeProps = {
  item: ItemWithiTunes;
  feedImage: string;
};

const dragPreview = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAA+CAYAAACbQR1vAAAAAXNSR0IArs4c6QAAAKRlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgExAAIAAAAfAAAAWodpAAQAAAABAAAAegAAAAAAAABIAAAAAQAAAEgAAAABQWRvYmUgUGhvdG9zaG9wIDIwMjIgTWFjaW50b3NoAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAQKADAAQAAAABAAAAPgAAAADzK4BoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEdGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx4bXBNTTpEZXJpdmVkRnJvbSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgIDxzdFJlZjppbnN0YW5jZUlEPnhtcC5paWQ6OUMxOTBERjc4QTA1MTFFQ0FBQUE4RUU2QzFBM0RCNkU8L3N0UmVmOmluc3RhbmNlSUQ+CiAgICAgICAgICAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6OUMxOTBERjg4QTA1MTFFQ0FBQUE4RUU2QzFBM0RCNkU8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgIDwveG1wTU06RGVyaXZlZEZyb20+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6OUMxOTBERkE4QTA1MTFFQ0FBQUE4RUU2QzFBM0RCNkU8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6OUMxOTBERjk4QTA1MTFFQ0FBQUE4RUU2QzFBM0RCNkU8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIDIwMjIgTWFjaW50b3NoPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqBDRLqAAAI6ElEQVRoBe1bV1dUVxTeU+lNFIYmYAMBS4xrJdbEaEx58ykrfyI+kfyGaB6y8jdSHmMgrsTYyLIhEUXEoIAQgaEOAzNMIfvblyPjwAC3IYEcuDO3nHvu3t+uZ587DuJ28eLFL2ZnI1/F4/FSh8Mxx82B8xutKd6cTueA1+v5urGx8TvHhQvfnM/Ly/k2FAoROOe2IZlXwgQIvDnS09NpcnLyvDsSCTeGQh6KRqMx7uRSHTfwNwQcY4G7Zmdnv3SzxEshdjDPwGxgvhdYY3Zd4Jm5LmUACEa/cHWT7DHPwrdzk/Cbks1ND4A7JTQ6L1hhRsoHYSy1r5MM3d0tAQAEu1wu4viqmwB1A8aIxRCI2BvzWJyTqEu2flsCAAgeH5+QDUzolR6YzcjMoBJfMXIRGhsbp7y8XFsZV4ObBgDMdjx+Qi0trTQzE34lRfWAlb5dLif5R6fo2JF9AgDGe9DeQWWlJbR7dzVFIlHdgK70zMTrhgFQat/V1U0/X7pKxUUFlJ7uSRx7Vfswm4yMNMrgzIw4GjucDh4njX74qZk+/+xTqqysQJJmGwiGjRaSikQi9KjjCRVuyWECOb2KxQ1tUTab+BzbvMrDGIi8vExqvnyNnj/vJbfbLaaxKkR1djIEAKSvARClUCgszg/njLXF982xKjgZ0QzWhEtNf1BPT59tIBgCYIFRJh7/i3lY6GJwD44RIGdlptMvDIJdmmASAIPcreo2h6g9QICPsEsTTANgg/Bfg0eZGzTBDhBMA/AatVYeKIfIYyoQMm3QhHUJANTexeHQmbDxKc4QnZSdlU5NzVept7ePPB79YTdZRusAAOaM7cjBf8qZRmYjNDoepGAwRFNTC1sgMEPB6bCkyd//2ESdnU+T+dF9bDgR0v2klDcI95wHILRq6l5bu5u2V5ZzKEwhH/SLc7DkexAtzMxB3jgAkHqa10NDg8MUDocpKyuLtm4tFPVXGrEUdgALDamymbYOAJjjJIcnUxMBavnzLh3YX88gZKyaJ/gB+Ayj7Y0DAMLjrM7I/7u7e+l5Tz/l5WZp/CDGLsmbliMgWzxz5iTl5ubIJMwIEOsCAHALe0bCA7UPBKY1AFJ8QuAADVEBabOZtm4AABNgCg0msVJzOjUAED3MtHUFABhR5gyNSNXQB9eX6ZLq1kXnU8SZRf3W5IRS7XB4VhybEZvWS+gbAWAppQXz0Whc6oEV5SXEa5V8HJNwqJcpPf3X3AQgVagvQEhUcqgzqkFnTp+goqKtNDQ0TL/9fpPLbCFKS/O88g96mFtN3zXVAGRsqCIhi4stUfVFWEtL84oW+LhA+tHZ9yQ8otJklzmsGQAIWYGpafIVb6Nz5z6hgwfrOc+fkTQW6g/PD81oarpCIyOjso+M8NT7R2mai63/KQBALErlYBqbx+Om6ekQlZYU0fHj71BhYQFtLdwiJgDmEf6G/eOS1k7zMn1T8xWamJiU5KaYAavbu5OmgtOmcv5U5mC5BoB5eHEw5PdP0shogHr6hsjn2yb2nZOTJQ5OJjHcF9/8sgJ9fPYE1dbsEMcXDM7Q9Ru3pBoMIBvqa8ljU2HUUicI5mfZxisry6iqquJVigJ7x6IHcnxMXsAwLkI7Jjnr+/D0Maqrq2WHN0MRLoF3d/fRixcvaZAnSBUVZbJIsnPHdnrS9YwyuTK0XI6QStKpzlsIAOdkkH4owpLcRdXVlSJBnEPDihHCmjrGOTACyU4GpmQmiPL3obf2U3//oADx7FkvlZQUiwmVc2hs+6tTQLQSAFtMAMxFoxHx+PD62FSVF9dUg2ZkZ2fwLPA+S3yAwSFmMJPKynwSKfzsDNXKkNfrFSAQLq1slgOAyQn+IOnkLRXhaV43l737ZFEFoVKpOXwJv8bCt/FYUh4DuUBA06pU4+k5bzkA8nCmcVWS4n4AKcRmk52dKV4e6i3VHh4IYMBPqDEXUifr1MAGABACncKYRvk8/UsgAuaj7BR9vkJeCN0hHWEq4xwCXcw8zMHj8QqaOB9J8iGJ4xvdtxAATSqc6PJ8fkocHohW21J1OwA1MRmkw2/vp/z8fJH4wMBL6u37Rxwk5gSIGPAVWH63TvEX4LIwCiChiYv93r7dRk//7pn3ASRxv6G+hnbtQpyPauYhZjInef7wsJ/Ky8s4+Zmgmy13pEYY4YIoQiBK45gPdHNEyOKSuKoZLLBgbs9SAEAK1Bq6MDjoF8r4UBhuvnxdpAoQ0NAvxhkgosCD9i7q47gflGzPQaNjAfrg1LusFXlyLyJEf/8QFRSg9IV5gQxhyYflACiqJNmZPwDBOP718g0BZ2/tHskL4swMTmC2FwgEZT4Akzh25CDV19UISEiOWu8/lPhvtfRBnm0AJCYr8H+QOKR99dotGh+boOHhEX4txivrAZIQ8XwBS+3Hjx6iffvqpD8IxNsifv8Y5XIKvdQMEn3MNNsASCYKTEITsAZw9167THu9XNJW55EpYiq8Z88u0RYURNra2un2nXapEtvBPGg0DYAec9Qi4RxhQgTGsaHhC1ECGtDR0UlVVdvp8eMuune/gwryc8S5SkcbPkwDYIQmRIvkBjCgAfdaH/L2SMBZmXkt60weS8+xSQBY/npUYBWUqbUBmMtSQCUOgbXDlOuHiR2X2TeUCMGhoaGKoy1RQ5WtQQKeHtqwvMfX6orpvJCCFaU5fsFK0SSE6fgwBADGh3QwQ6ut2UlDwxOSuiKzW6sNz6zmmgMEsDxYy6Nh2ASAOEDAUjZmbDdutnJI197u0lzb8g82chU6hmV0aNv7Jw9TQ8Ne0RYjY6l7DAOAAaCqSFUPHGjgwoVPipkAA+BYDQKYx/M8HEa3bCngFzO3yXMgBKPqDx5MAaBpAZKcOZ7RFckGIu1silnkDWaZNw0ABpj3hzLJsZPx5LEBhAIj+ZqeY1MakPggK4hJHG+t9g1HgbUi0O7n/A8Aqy5+SGiv57JbjAbGVzy7eWeAtzIeI8YefOVXMww8bB3eEmOeuezo7HfzBOQi/4wUP52d/zHhpvjprAs/neWc5YIk8Jv5x9P/AhDuNJFF5mlsAAAAAElFTkSuQmCC';

const Episode = ({ item, feedImage }: EpisodeProps) => {
  const [{ opacity }, drag, preview] = useDrag(
    () => ({
      type: PODCAST_EPISODE,
      item,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [],
  );

  const duration = useMemo(() => {
    if (item.itunes.duration) {
      return durationToSeconds(item.itunes.duration);
    }

    return 0;
  }, [item]);

  const image = useMemo(() => {
    return (item.itunes && item.itunes.image)
      ? item.itunes.image
      : feedImage
  }, [item, feedImage]);

  return (
    <>
      <DragPreviewImage connect={preview} src={dragPreview} />
      <div className={styles.episode} ref={drag} style={{ opacity }}>
        <img
          src={image}
          alt="Episode Image"
          className="img-flulid"
          loading="lazy"
        />
        <div className={styles.info}>
          <div className={styles.title}>{item.title}</div>
          {item.itunes && <div className={styles.duration}>{secondsToDuration(duration)}</div>}
          <p className={styles.description} title={item.contentSnippet}>
            <Truncate lines={2}>
              {item.contentSnippet}
            </Truncate>
          </p>
        </div>
      </div>
    </>
  )
};

export default Episode;
