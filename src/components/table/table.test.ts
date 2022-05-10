import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-table>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-table></sl-table> `);

    expect(el).to.exist;
  });
});
