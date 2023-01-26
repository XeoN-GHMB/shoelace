import { expect, fixture, html } from '@open-wc/testing';
import type SlSpinnerCircle from './spinner-circle';

describe('<sl-spinner-circle>', () => {
  describe('when provided no parameters', () => {
    it('should pass accessibility tests', async () => {
      const spinner = await fixture<SlSpinnerCircle>(html` <sl-spinner-circle></sl-spinner-circle> `);
      await expect(spinner).to.be.accessible();
    });

    it('should have a role of "status".', async () => {
      const spinner = await fixture<SlSpinnerCircle>(html` <sl-spinner-circle></sl-spinner-circle> `);
      const base = spinner.shadowRoot!.querySelector('[part~="base"]')!;
      expect(base).have.attribute('role', 'progressbar');
    });

    it('should use "transform: rotate(x)" instead of "rotate: x" when animating', async () => {
      const spinner = await fixture<SlSpinnerCircle>(html` <sl-spinner-circle></sl-spinner-circle> `);
      const indicator = spinner.shadowRoot!.querySelector('.spinner__indicator')!;

      //
      // This matrix is the computed value when using `transform: rotate(x)` on the indicator. When using `rotate: x`,
      // it will be "none" instead.
      //
      // Related: https://github.com/shoelace-style/shoelace/issues/1121
      //
      expect(getComputedStyle(indicator).transform).to.equal('matrix(1, 0, 0, 1, 0, 0)');
    });
  });
});
