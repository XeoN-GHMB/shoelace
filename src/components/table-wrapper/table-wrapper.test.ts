import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-table-wrapper>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-table-wrapper></sl-table-wrapper> `);

    expect(el).to.exist;
  });
});
