// import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
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
  faShuffle,
  faSearch,
  faPlus,
  faMinus,
  faChevronUp,
  faChevronDown,
  faHeart,
  faHeartCrack,
  faDownload,
  faClipboard,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
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
  faSpinner,
  faShuffle,
  faSearch,
  faFacebook,
  faGoogle,
  faPlus,
  faMinus,
  faChevronUp,
  faChevronDown,
  faHeart,
  faHeartCrack,
  faDownload,
  faClipboard,
);

const Icon = (props: FontAwesomeIconProps) => {
  return <FontAwesomeIcon {...props} />;
};

export default Icon;
