import { getBasePath } from '../../utilities/base-path.js';
import type { IconLibrary } from './library.js';

const library: IconLibrary = {
  name: 'default',
  resolver: name => getBasePath(`assets/bootstrap-icons/${name}.svg`)
};

export default library;
