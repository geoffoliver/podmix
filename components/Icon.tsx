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
  faPlay,
  faPause,
  faForwardStep,
  faBackwardStep,
  faVolumeHigh,
  faVolumeXmark,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

library.add(
  faRss,
  faFileAudio,
  faGlobe,
  faTrashAlt,
  faSignOut,
  faCamera,
  faPlay,
  faPause,
  faForwardStep,
  faBackwardStep,
  faVolumeXmark,
  faVolumeHigh,
  faSpinner
  // faVolumeLow,
);

const Icon = (props: FontAwesomeIconProps) => {
  return <FontAwesomeIcon {...props} />
};

export default Icon;
