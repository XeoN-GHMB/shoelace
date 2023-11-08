import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-bar>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-bar></sl-bar> `);

    expect(el).to.exist;
  });
});
