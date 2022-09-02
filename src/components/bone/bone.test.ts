import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-bone>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-bone></sl-bone> `);

    expect(el).to.exist;
  });
});
