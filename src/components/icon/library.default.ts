import { getBasePath } from '../../utilities/base-path';
import type { IconLibrary } from './library';

const library: IconLibrary = {
  name: 'default',
  resolver: name => `${getBasePath()}/assets/icons/${name}.svg`,
  mutator: svg => {
    svg.setAttribute('fill', 'currentColor');
    //svg.setAttribute('stroke', 'currentColor');
    [...svg.querySelectorAll('*')].map(el => el.setAttribute('fill', 'inherit'));
  }
};

export default library;
