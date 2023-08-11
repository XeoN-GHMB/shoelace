import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
//import type SlSpinner from './spinner';

describe('<sl-spinner-viur>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-spinner-viur></sl-spinner-viur> `);

    expect(el).to.exist;
  });
});
