import type { ReactiveController, ReactiveElement } from 'lit';

/**
 * A controller that repeatedly calls the specified callback with the provided interval time.
 * The timer is automatically paused while the user is interacting with the component.
 */
export class AutoplayController implements ReactiveController {
  private host: ReactiveElement;
  private timerId = 0;
  private tickCallback: () => void;

  paused = false;
  stopped = true;

  constructor(host: ReactiveElement, tickCallback: () => void) {
    host.addController(this);

    this.host = host;
    this.tickCallback = tickCallback;
  }

  hostConnected(): void {
    this.host.addEventListener('mouseenter', this.pause);
    // @ts-ignore
    this.host.addEventListener('mouseleave', ()=>this.start( this.host.autoplayInterval ));
    this.host.addEventListener('focusin', this.pause);
    // @ts-ignore
    this.host.addEventListener('focusout', ()=>this.start( this.host.autoplayInterval ));
    this.host.addEventListener('touchstart', this.pause, { passive: true });
    // @ts-ignore
    this.host.addEventListener('touchend', ()=>this.start( this.host.autoplayInterval ));
  }

  hostDisconnected(): void {
    this.stop();

    this.host.removeEventListener('mouseenter', this.pause);
    // @ts-ignore
    this.host.removeEventListener('mouseleave', ()=>this.start( this.host.autoplayInterval ));
    this.host.removeEventListener('focusin', this.pause);
    // @ts-ignore
    this.host.removeEventListener('focusout', ()=>this.start( this.host.autoplayInterval ));
    this.host.removeEventListener('touchstart', this.pause);
    // @ts-ignore
    this.host.removeEventListener('touchend', ()=>this.start( this.host.autoplayInterval ));
  }

  start(interval: number) {
    this.stop();
    this.stopped = false;
    this.paused = false;
    this.timerId = window.setInterval(() => {
      if (!this.paused) {
        this.tickCallback();
      }
    }, interval);
  }

  stop() {
    clearInterval(this.timerId);
    this.stopped = true;
    this.host.requestUpdate();
  }

  pause = () => {
    this.paused = true;
    this.host.requestUpdate();
  };

  resume = () => {
    this.paused = false;
    this.host.requestUpdate();
  };
}
