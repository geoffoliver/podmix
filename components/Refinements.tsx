import { useCallback, useMemo } from 'react';
import { Badge, Form } from 'react-bootstrap';

import { RefinementItem } from "@/lib/types/search";

import styles from '@/styles/Refinements.module.scss';

type RefinementsProps = {
  items: RefinementItem[];
  currentRefinement: string[];
  refine: Function;
  isFromSearch: boolean;
  searchForItems: Function;
  createURL: Function;
};

const Refinements = ({ items, refine, currentRefinement }: RefinementsProps) => {
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
    return items.sort((a, b) => a.label.localeCompare(b.label));
  }, [items]);

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
    </>
  )
};

export default Refinements;
