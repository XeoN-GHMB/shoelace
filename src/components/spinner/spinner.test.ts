import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
//import type SlSpinner from './spinner';

describe('<sl-spinner>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-spinner></sl-spinner> `);

    expect(el).to.exist;
  });
});
