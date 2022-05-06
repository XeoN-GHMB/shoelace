import { getBasePath } from '../../utilities/base-path';
import type { IconLibrary } from './library';

const library: IconLibrary = {
  name: 'bootstrap',
  resolver: name => `${getBasePath()}/assets/bootstrap-icons/${name}.svg`
};

export default library;
