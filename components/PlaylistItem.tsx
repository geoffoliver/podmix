/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from 'react-bootstrap';
// import { DateTime } from 'luxon';

import PlaylistItem from "@/lib/models/playlistItem";

import styles from './PlaylistItem.module.scss';
import { Identifier, XYCoord } from 'dnd-core';
import { PLAYLIST_ENTRY } from '@/lib/types/playlist';

type PlaylistItemProps = {
  item: PlaylistItem;
  index: number;
  onRemove: Function;
  onMove: (dragIndex: number, hoverIndex: number) => void;
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const PlaylistItemComponent = ({ item, index, onRemove, onMove }: PlaylistItemProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: PLAYLIST_ENTRY,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: PLAYLIST_ENTRY,
    item: () => {
      return {
        id: item.id,
        index
      }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div className={styles.item} style={{ opacity }} ref={ref}>
      <div className={styles.titleContainer}>
        <img src={item.image} height="40" width="40" alt={`${item.title} image`} />
        <div className="ps-2">
          <div className={styles.title}>{item.title}</div>
          <div className="text-muted small">{item.duration}</div>
        </div>
      </div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => onRemove(item)}
      >
        Remove
      </Button>
    </div>
  );

};

export default PlaylistItemComponent;
