import { expect, fixture, html } from '@open-wc/testing';
// import sinon from 'sinon';

//import type SlPagination from './pagination';

describe('<sl-pagination>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-pagination></sl-pagination> `);

    expect(el).to.exist;
  });
});
