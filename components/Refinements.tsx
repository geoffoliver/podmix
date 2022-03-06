import { useCallback, useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import { RefinementItem } from '@/lib/types/search';
import Icon from '@/components/Icon';

import styles from '@/styles/Refinements.module.scss';

type RefinementsProps = {
  items: RefinementItem[];
  currentRefinement: string[];
  refine: Function;
  isFromSearch: boolean;
  searchForItems: Function;
  createURL: Function;
};

const defaultLimit = 5;
const maxLimit = 50;

const Refinements = ({ items, refine, currentRefinement }: RefinementsProps) => {
  const [limit, setLimit] = useState(defaultLimit);

  const doRefine = useCallback((e) => {
    let vals = currentRefinement;

    if (e.target.checked) {
      vals.push(e.target.value);
    } else {
      vals = vals.filter((v) => v !== e.target.value);
    }

    refine(vals);
  }, [refine, currentRefinement]);

  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.label.localeCompare(b.label)).slice(0, limit);
  }, [items, limit]);

  return (
    <>
      {sortedItems.map((item) => {
        const id = `refinement-check-${item.label.replace(/^\w/g, '-')}`;
        const label = (
          <div className={styles.labelContainer}>
            <div className={styles.label}>{item.label}</div>
            <div className={styles.count}>({item.count})</div>
          </div>
        );

        return (
          <div
            className={styles.refinement}
            key={item.label}
          >
            <Form.Check
              type="checkbox"
              value={item.label}
              checked={currentRefinement.includes(item.label)}
              label={label}
              id={id}
              onChange={doRefine}
            />
          </div>
        );
      })}
      {(items.length > limit || limit === maxLimit) && (
        <div className={styles.showMoreLess}>
          <Button variant="link" size="sm" className="p-0" onClick={() => setLimit(limit > defaultLimit ? defaultLimit : maxLimit)}>
            {limit > defaultLimit ? (
              <>
                <Icon icon="minus" className="me-1" fixedWidth /> Show Less
              </>
            ): (
              <>
                <Icon icon="plus" className="me-1" fixedWidth /> Show More
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default Refinements;
