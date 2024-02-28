import { getBasePath } from '../../utilities/base-path.js';
import type { IconLibrary } from './library.js';

const library: IconLibrary = {
  name: 'default',
  resolver: (name,sprite=false) => {
    if(sprite){
      return getBasePath(`assets/bootstrap-icons/${name}.svg`)
    }else{
      return getBasePath(`assets/bootstrap-icons/${name.substring(0,1)}/${name}.svg`)
    }
  }

};

export default library;
