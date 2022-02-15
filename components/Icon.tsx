// import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faRss,
  faFileAudio,
  faGlobe,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

library.add(
  faRss,
  faFileAudio,
  faGlobe,
  faTrashAlt,
);

const Icon = (props: FontAwesomeIconProps) => {
  return <FontAwesomeIcon {...props} />
};

export default Icon;
