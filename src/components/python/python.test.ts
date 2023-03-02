import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-python>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-python></sl-python> `);

    expect(el).to.exist;
  });
});
