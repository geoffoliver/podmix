/* eslint-disable @next/next/no-img-element */
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';

import { SearchResult } from '@/lib/types/search';

import styles from '@/styles/SearchResult.module.scss';
import { secondsToDuration } from '@/lib/util';

type SearchResultParams = {
  hit: SearchResult;
};

const SearchResultComponent = ({ hit }: SearchResultParams) => {
  return (
    <div className={styles.searchResult}>
      <Row>
        <Col sm={2}>
          <Link href={`/playlist/${hit.objectID}`}>
            <a>
              <img
                src={hit.image || `/api/playlists/image/${hit.objectID}`}
                alt={`Image for ${hit.name}`}
                className="img-fluid"
              />
            </a>
          </Link>
        </Col>
        <Col sm={10}>
          <h1 className={styles.name}>
            <Link href={`/playlist/${hit.objectID}`}>
              <a>
                {hit.name}
              </a>
            </Link>
          </h1>
          <div className={styles.description}>
            {hit.description}
          </div>
          <div className={styles.details}>
            <div className={styles.trackCount}>
              {hit.episodes.length} Episodes
            </div>
            <div className={styles.duration}>
              {secondsToDuration(hit.duration)}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SearchResultComponent;
