import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { castDate, isValidDate, parseDate } from '../../internal/date.util';
import { emit } from '../../internal/event';
import { watchProps } from '../../internal/watchProps';
import SlDatePanel from '../date-panel/date-panel';
import SlDropdown from '../dropdown/dropdown';
import SlInput from '../input/input';
import styles from './date.styles';

/**
 * @since 2.0
 * @status experimental
 *
 * @dependency sl-date-panel
 *
 * @event sl-date-change - Emitted when date change  .
 *
 *
 *
 * @csspart sl-date-panel - The component's base wrapper.
 * @csspart input - The input text.
 * @csspart base - The input wrap container.
 *
 */
@customElement('sl-date')
export default class SlDate extends LitElement {
  static styles = styles;

  /**
   * The preferred placement of the dropdown panel. Note that the actual placement may vary as needed to keep the panel
   * inside of the viewport.
   */
  @property() placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end' = 'bottom-start';

  /** Makes the input readonly. */
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) clearable = false;
  @property({ type: String, reflect: true, attribute: 'placeholder' }) placeholder: string;
  /** Makes  dropDown hoist. */
  @property({ type: Boolean, attribute: false }) hoist = true;
  /** set  dropDown distance for trigger. */
  @property({ type: Number, attribute: false }) distance = 5;

  /** set input size  */
  @property({ type: String, attribute: 'size' }) size: 'small' | 'medium' | 'large' = 'medium';
  /** Disables the input. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Draws a pill-style button with rounded edges. */
  @property({ type: Boolean, reflect: true }) pill = false;

  /** if true,  select a date ,close the dropDown */
  @property({ type: Boolean }) immediate = true;

  /** Check the date , format:2018，2018-02, 2018/01， 2018/02/02 ,2018-01-02 */
  @property({ type: String, attribute: 'value' }) value?: string;
  /** Select mode, year, month, day */
  @property({ type: String, attribute: 'mode' }) mode: 'year' | 'month' | 'date' = 'date';
  /** Minimum value */
  @property({ type: String, attribute: false }) min?: string | number;
  /** Maximum value */
  @property({ type: String, attribute: false }) max?: string | number;

  get maxDate() {
    return this.max ? castDate(this.max) : null;
  }
  get minDate() {
    return this.min ? castDate(this.min) : null;
  }
  /** display  as  block div */
  @property({ type: Boolean, attribute: 'block', reflect: true }) block = false;
  firstUpdated(map: PropertyValues) {
    super.firstUpdated(map);
  }
  private handlerDateSelect(event: CustomEvent) {
    this.value = event.detail.value;
    if (this.immediate && !event.detail.key) {
      let dropDown = this.renderRoot.querySelector('#dropDown') as SlDropdown;
      dropDown.open = false;
    }
    this.emitDateSelect();
  }
  protected emitDateSelect() {
    emit(this, 'sl-date-change', {
      detail: { value: this.valueDateString, date: this.valueDate }
    });
  }
  /** The date corresponding to the internal value  */
  @state()
  valueDate?: Date;

  /**Get the date display value */
  public get valueDateString() {
    return this.valueDate ? parseDate(this.valueDate, this.mode) : '';
  }
  @query('#sl-date-panel')
  datePanel: SlDatePanel;
  @query('#dropDown')
  dropDown: SlDropdown;

  @watchProps(['disabled', 'readonly'], { waitUntilFirstUpdate: true })
  watchDisabledPanel() {
    if (this.disabled || this.readonly) {
      this.dropDown.open = false;
    }
  }

  focus(option: FocusOptions) {
    this.updateComplete.then(() => {
      const input = this.renderRoot.querySelector('sl-input[part="sl-date-input"]') as SlInput;
      if (input) {
        input.focus(option);
      }
    });
  }
  @watchProps(['value', 'mode'])
  watchSelectModeChange() {
    let dateTemp = castDate(this.value);
    if (isValidDate(dateTemp)) {
      this.value = parseDate(this.value as string, this.mode);
      this.valueDate = new Date(this.value);
    } else {
      this.value = undefined;
      this.valueDate = undefined;
    }
  }
  @property({ type: Boolean, reflect: true }) invalid = false;
  private handlerInputClick(event: InputEvent) {
    let oldDateString = this.valueDateString;
    const input = event.target as SlInput;
    const date = input.value.trim() == '' ? null : castDate(input.value);
    if (isValidDate(date)) {
      this.value = input.value.trim();
      this.invalid = false;
      this.datePanel.value = this.valueDateString;
      this.watchSelectModeChange();
      this.emitDateSelect();
    } else {
      this.value = undefined;
      input.value = oldDateString;
      this.invalid = true;
    }
  }
  render() {
    return html` <sl-dropdown .distance=${this.distance} id="dropDown" part="dropDown" .placement=${this.placement} .hoist=${this.hoist} .disabled=${this.readonly || this.disabled}>
      <sl-input
        slot="trigger"
        part="sl-date-input"
        exportparts="base:base,input:input"
        @sl-change=${this.handlerInputClick}
        .value=${this.valueDateString}
        .pill=${this.pill}
        .clearable=${this.clearable}
        .placeholder=${this.placeholder}
        .readonly=${this.readonly}
        .disabled=${this.disabled}
        .invalid=${this.invalid}
        .size=${this.size}
        >${this.valueDateString}
        <sl-icon slot="suffix" name="calendar3"></sl-icon>
      </sl-input>
      <div part="date-panel-div">
        <sl-date-panel id="sl-date-panel" .value=${this.value} .mode=${this.mode} .min=${this.min} .max=${this.max} @sl-date-select=${this.handlerDateSelect}></sl-date-panel>
      </div>
    </sl-dropdown>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-date': SlDate;
  }
}
