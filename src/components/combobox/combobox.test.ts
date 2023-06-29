/*import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

import type SlInput from '../input/input';
import type SlCombobox from "./combobox";
import type { SuggestionSource } from "./combobox";
import type SlMenu from "../menu/menu";
import Sinon from "sinon";
import SlMenuItem from "../menu-item/menu-item";
// @ts-ignore
const dummyDataSource: SuggestionSource = async (text) => ([
  {text: 'test', value: 'test'},
  {text: 'test2', value: 'test2value'},
]);

describe('<sl-input>', () => {
  describe('no source', () => {
    it('should be accessible', async () => {
      const el = await fixture<SlCombobox>(html`<sl-combobox label="test"></sl-combobox>`);
      await expect(el).to.be.accessible();
    });

    it('should show empty message', async () => {
      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      const menu = el.shadowRoot?.querySelector('[part="menu"]') as SlMenu;
      input.focus();

      await sendKeys({
        type: 'a'
      });

      await expect(menu).to.contain.text('no data found');
    });
  });

  describe('with source', () => {
    it('should be accessible', async () => {
      // @ts-ignore
      const emptyDataSource = async (search: string) => ([]);
      const el = await fixture<SlCombobox>(html`<sl-combobox label="test"></sl-combobox>`);
      el.source = emptyDataSource;
      await expect(el).to.be.accessible();
    });

    it('should show empty message when no data is available', async () => {
      // @ts-ignore
      const emptyDataSource = async (search: string) => ([]);
      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = emptyDataSource;
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      const menu = el.shadowRoot?.querySelector('[part="menu"]') as SlMenu;
      input.focus();

      await sendKeys({
        type: 'a'
      });

      await expect(menu).to.contain.text('no data found');
    })

    it('should suggest items coming back from source method', async () => {
      // @ts-ignore
      const dummyDataSource: SuggestionSource = async (search: string) => ([
        {text: 'test', value: 'test'},
        {text: 'test2', value: 'test2'},
      ]);

      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = dummyDataSource;
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      const menu = el.shadowRoot?.querySelector('[part="menu"]') as SlMenu;
      input.focus();

      await sendKeys({
        type: 't'
      });

      await expect(menu).to.contain.text('test');
      await expect(menu).to.contain.text('test2');
    });

    it('should activate first item when pressing arrow down', async () => {
      // @ts-ignore
      const dummyDataSource: SuggestionSource = async (search: string) => ([
        {text: 'test', value: 'test'},
      ]);

      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = dummyDataSource;
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      const menu = el.shadowRoot?.querySelector('[part="menu"]') as SlMenu;
      input.focus();

      await sendKeys({
        type: 't'
      });

      await sendKeys({
        press: 'ArrowDown'
      });

      await expect(menu.getAllItems()[0].getAttribute('active')).to.equal('');
    });

    it('should keep focus on input when navigation with arrow keys', async () => {
      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = dummyDataSource;
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      input.focus();

      await sendKeys({
        type: 't'
      });

      await sendKeys({
        press: 'ArrowDown'
      });

      await expect(el.shadowRoot?.activeElement).to.equal(input);
    });

    it('should give the input the correct aria attributes', async () => {
      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = dummyDataSource;
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      const menu = el.shadowRoot?.querySelector('[part="menu"]') as SlMenu;
      input.focus();

      await sendKeys({
        type: 't'
      });

      await sendKeys({
        press: 'ArrowDown'
      });

      await expect(input.getAttribute('role')).to.equal('combobox');
      await expect(input.getAttribute('aria-controls')).to.equal(menu.getAttribute('id'));
      await expect(input.getAttribute('aria-autocomplete')).to.equal('list');
      await expect(input.getAttribute('aria-expanded')).to.equal('true');
      await expect(input.getAttribute('aria-activedescendant')).to.equal(`${menu.getAttribute('id')}-item-0`);
    });

    it('should emit sl-item-select event when an option is selected via enter', async () => {
      const selectHandler = Sinon.spy();
      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = dummyDataSource;
      el.addEventListener('sl-item-select', selectHandler);
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      input.focus();

      await sendKeys({
        type: 't'
      });

      await sendKeys({
        press: 'ArrowDown'
      });

      await sendKeys({
        press: 'Enter'
      });

      await expect(selectHandler.calledOnce).to.be.true;
    });

    it('should emit sl-item-select event when an option is selected via click', async () => {
      const selectHandler = Sinon.spy();
      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = dummyDataSource;
      el.addEventListener('sl-item-select', selectHandler);
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      const menu = el.shadowRoot?.querySelector('[part="menu"]') as SlMenu;
      input.focus();

      await sendKeys({
        type: 't'
      });

      menu.getAllItems()[0].click();

      await expect(selectHandler.calledOnce).to.be.true;
    });

    it('should set the input value to the text of the suggestion when selected', async () => {
      let selectedItem: SlMenuItem;
      const selectHandler = (event: CustomEvent) => selectedItem = event.detail.item;
      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = dummyDataSource;
      el.addEventListener('sl-item-select', selectHandler);
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      input.focus();

      await sendKeys({
        type: 't'
      });

      await sendKeys({
        press: 'ArrowDown'
      });

      await sendKeys({
        press: 'ArrowDown'
      });

      await sendKeys({
        press: 'Enter'
      });
      // @ts-ignore
      await expect(input.value).to.equal(selectedItem.textContent);
    });

    it('should not set the input value to the text of the suggestion when select event default is prevented', async () => {
      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = dummyDataSource;
      el.addEventListener('sl-item-select', (event) => event.preventDefault());
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      input.focus();

      await sendKeys({
        type: 't'
      });

      await sendKeys({
        press: 'ArrowDown'
      });

      await sendKeys({
        press: 'ArrowDown'
      });

      await sendKeys({
        press: 'Enter'
      });

      await expect(input.value).to.equal('t');
    });

    it('pressing escape should hide the menu and clear the input', async () => {
      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = dummyDataSource;
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      input.focus();

      await sendKeys({
        type: 't'
      });

      await sendKeys({
        press: 'Escape'
      });

      await expect(input.value).to.equal('');
      await expect(el.dropdown.open).to.be.false;
    });

    it('should not open menu on focus when input value is empty', async () => {
      const fix = await fixture(html`
        <div>
          <sl-combobox></sl-combobox>
          <div></div>
        </div>`);
      const el = fix.querySelector('sl-combobox')!;
      el.source = dummyDataSource;
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      input.focus();

      await expect(el.dropdown.open).to.be.false;
    });

    it('should open menu when input gains focus', async () => {
      const fix = await fixture(html`
        <div>
          <sl-combobox></sl-combobox>
            <input class="other-focus"/>
        </div>`);
      const el = fix.querySelector('sl-combobox')!;
      const otherFocus: HTMLInputElement = fix.querySelector('.other-focus')!;
      el.source = dummyDataSource;
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;

      input.focus();

      await sendKeys({
        type: 'a',
      });

      otherFocus.focus();

      input.focus()

      await expect(el.dropdown.open).to.be.true;
    });

    it('should set input value when clicking suggestion', async () => {
      const el = await fixture<SlCombobox>(html`<sl-combobox></sl-combobox>`);
      el.source = dummyDataSource;
      const input = el.shadowRoot?.querySelector('[part="input"]') as SlInput;
      const menu = el.shadowRoot?.querySelector('[part="menu"]') as SlMenu;

      input.focus();

      await sendKeys({
        type: 'a',
      });

      const firstSuggestion = menu.getAllItems()[0];

      firstSuggestion.click();

      await expect(input.value).to.equal(firstSuggestion.textContent);
    });
  });
});
*/

import { expect, fixture, html } from '@open-wc/testing';

describe('<sl-combobox>', () => {
  it('should render a component', async () => {
    const el = await fixture(html` <sl-combobox></sl-combobox> `);

    expect(el).to.exist;
  });
});

