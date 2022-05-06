import { unWrapData, wrapData } from '../../utilities/wrapData';
import { ResovlePathInterface, defaultResove } from './pathResovle';
export const CryptoHashResovle: ResovlePathInterface = {
  resolvePath(hash) {
    if (hash.length > 1 && hash.substr(0, 1) == '#') {
      hash = hash.slice(1); //#,去掉
    }
    const decryptData = unWrapData(hash);
    return defaultResove.resolvePath(decryptData);
  },
  toPath(url, jsonData) {
    const result = defaultResove.toPath(url, jsonData);
    const enryptText = wrapData(result);
    return enryptText;
  }
};
