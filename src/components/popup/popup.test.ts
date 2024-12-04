import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlPopup from './popup.js';

describe('<sl-popup>', () => {
  let element: SlPopup;

  it('should render a component', async () => {
    const el = await fixture(html` <sl-popup></sl-popup> `);

    expect(el).to.exist;
  });

  it('should properly handle positioning when active changes', async () => {
    element = await fixture('<sl-popup></sl-popup>');

    element.active = true;
    await element.updateComplete;

    // SImulate a scroll event
    const event = new Event('scroll');
    window.dispatchEvent(event);

    element.active = false;
    await element.updateComplete;

    // The component should not throw an error when the window is scrolled
    expect(() => {
      element.active = true;
      window.dispatchEvent(event);
    }).not.to.throw();
  });
});
