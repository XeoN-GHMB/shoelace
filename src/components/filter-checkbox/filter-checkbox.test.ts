import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-filter-checkbox>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-filter-checkbox></sl-filter-checkbox> `);

    expect(el).to.exist;
  });
});
