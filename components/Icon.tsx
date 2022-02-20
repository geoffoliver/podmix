// import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faRss,
  faFileAudio,
  faGlobe,
  faTrashAlt,
  faSignOut,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

library.add(
  faRss,
  faFileAudio,
  faGlobe,
  faTrashAlt,
  faSignOut,
  faCamera,
);

const Icon = (props: FontAwesomeIconProps) => {
  return <FontAwesomeIcon {...props} />
};

export default Icon;
