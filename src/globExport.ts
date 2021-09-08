import { html, render } from 'lit';
import { restoreFromLocalCache, restoreTableDefault } from './components/table/tableCacheHelper';
import { onEvent } from './utilities/common';
declare global {
  interface Window {
    html: typeof html;
    onEvent: typeof onEvent;
    LitRender: typeof render;
    restoreFromLocalCache: typeof restoreFromLocalCache;
    restoreTableDefault: typeof restoreTableDefault;
  }
}
(globalThis as any).html = html;
(globalThis as any).onEvent = onEvent;
(globalThis as any).LitRender = render;
(globalThis as any).restoreTableDefault = restoreTableDefault;
(globalThis as any).restoreFromLocalCache = restoreFromLocalCache;
