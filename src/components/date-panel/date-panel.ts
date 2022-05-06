import { html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { castDate, getDaysPanel, isEqualsDate, parseDate } from '../../internal/date.util';
import { emit } from '../../internal/event';
import resourceLocal from '../../internal/resourceLocal';
import { watchProps } from '../../internal/watchProps';
import { addEvent, animateCss, onEvent } from '../../utilities/common';
import { getResouceValue } from '../../utilities/getResouce';
import styles from './date-panel.styles';

/**
 * @since 2.0
 * @status experimental
 *
 *
 *
 * @event  sl-date-select - Emitted when a date select.
 *
 *
 *
 * @csspart base - The component's base wrapper.
 * @csspart prevButton - The component's prevButton .
 * @csspart nextButton - The component's prevButton .
 * @csspart panel-base - The component's  panel wrap select DIV.
 * @csspart date-date - The component's  select date panel.
 * @csspart date-month - The component's  select month panel.
 * @csspart date-year - The component's  select year panel.
 * @csspart item-year - The component's year panel item: item year.
 * @csspart item-month - The component's month panel item: item month.
 * @csspart item-date - The component's day panel item: item day .
 *
 * @cssproperty --example - An example CSS custom property.
 */

@resourceLocal()
@customElement('sl-date-panel')
export default class SlDatePanel extends LitElement {
  static styles = styles;

  /** Check the date , format: 2018，2018-02, 2018/01， 2018/02/02 ,2018-01-02 */
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

  @state()
  private innerMode: 'year' | 'month' | 'date' = 'date';

  private get _innerYear() {
    return this.innerDate.getFullYear();
  }

  private get _innerMonth() {
    return this.innerDate.getMonth();
  }

  /** The date corresponding to the internal value */
  @state()
  valueDate?: Date;

  public get valueDateString() {
    return this.valueDate ? parseDate(this.valueDate, this.mode) : '';
  }

  /** Internal: Maintain the time displayed after switching the upper and lower panels */
  @state()
  private innerDate: Date = new Date();
  @watchProps(['value', 'mode'])
  watchSelectModeChange() {
    this.innerMode = this.mode;
    let dateTemp = castDate(this.value);
    if (dateTemp) {
      this.value = parseDate(this.value as string, this.mode);
      this.innerDate = new Date(+dateTemp);
      this.valueDate = dateTemp;
    }
    if (!this.innerDate) {
      this.innerDate = new Date();
    }
  }
  private get innerDisplayDateStr(): string {
    const date = this.innerDate;
    return getResouceValue('date.showHeaderStr')(date, this.innerMode);
  }
  /** Rendering top */
  private renderHeader() {
    return html`<button class="button" part="prevButton" id="prevButton">
        <svg class="icon" viewBox="0 0 1024 1024">
          <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8c-16.4 12.8-16.4 37.5 0 50.3l450.8 352.1c5.3 4.1 12.9 0.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
        </svg>
      </button>
      <span class=" date-switch" part="date-switch">${this.innerDisplayDateStr}</span>
      <button class="button" id="nextButton" part="nextButton">
        <svg class="icon" viewBox="0 0 1024 1024">
          <path d="M765.7 486.8L314.9 134.7c-5.3-4.1-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-37.6 0-50.4z"></path>
        </svg>
      </button> `;
  }
  /** Rendering of weeks and months of days */
  private renderDatePanel() {
    const weekArray = getResouceValue('date.weekDays') as Array<string>;
    const weeks = html`${weekArray.map(item => html`<span class="date-week-item" part="week-head">${item}</span>`)} `;
    let minDate = this.minDate;
    const maxDate = this.maxDate;
    const dateArray = getDaysPanel(this._innerYear, this._innerMonth + 1);
    const dateResult = [];
    for (let i = 0, j = dateArray.length; i < j; i++) {
      const tempDate = dateArray[i];
      let other = this._innerYear !== tempDate.getFullYear() || this._innerMonth !== tempDate.getMonth();
      const disabled = (minDate != null && tempDate < minDate) || (maxDate != null && tempDate > maxDate);
      const isCurent = this.innerDate && isEqualsDate(tempDate, this.valueDate, 'date');
      dateResult.push(html`<button part="item-date" class="date-button date-day-item ${other ? 'other' : ''} ${isCurent ? 'current' : ''} " .date=${tempDate} .disabled=${disabled}>${tempDate.getDate()}</button>`);
    }
    return html`<div class="date-body">${weeks}${dateResult}</div>`;
  }
  /** Rendering Year Selected Month Body */
  private renderMonthBody() {
    const current = this.innerDate;
    if (current) {
      const year = current.getFullYear();
      const minDate = this.minDate;
      const maxDate = this.maxDate;
      const month = getResouceValue('date.months') as Array<string>;
      return month.map((value: string, index: number) => {
        const date = new Date(year, index);
        let disabled = minDate != null && (year < minDate.getFullYear() || (minDate.getFullYear() === year && index < minDate.getMonth()));
        if (!disabled) {
          disabled = maxDate != null && (year > maxDate.getFullYear() || (maxDate.getFullYear() === year && index > maxDate.getMonth()));
        }
        return html`<button part="item-month" .date=${date} class="date-button date-day-item ${isEqualsDate(date, this.valueDate, 'month') ? 'current' : ''}" ?disabled=${disabled}>${value}</button>`;
      });
    }
    return nothing;
  }
  /** Triggers the date-select event */
  private emitValueSelectEvent(detail = {}) {
    this.watchSelectModeChange();
    emit(this, 'sl-date-select', {
      detail: {
        value: this.valueDateString,
        date: this.valueDate,
        ...detail
      }
    });
  }
  /** Rendering Year Selected Month Body */
  private renderYearBody() {
    const current = this.innerDate;
    const result = [];
    if (current) {
      const nv = current.getFullYear();
      const n = parseInt(String(nv / 20));
      const year = n * 20;
      const minDate = this.minDate;
      const maxDate = this.maxDate;
      for (let i = year, j = year + 20; i < j; i++) {
        const date = new Date(i, 0, 1);
        let disabled = minDate != null && i < minDate.getFullYear();
        if (!disabled) {
          disabled = maxDate != null && i > maxDate.getFullYear();
        }
        result.push(html`<button part="item-year" .date=${date} class="date-button date-day-item ${isEqualsDate(date, this.valueDate, 'year') ? 'current' : ''}" ?disabled=${disabled}>${i}</button>`);
      }
    }
    return result;
  }
  firstUpdated(map: PropertyValues) {
    super.firstUpdated(map);
    const baseDIV = this.renderRoot.querySelector('div[part=base]') as HTMLElement;
    const panelBase = this.renderRoot.querySelector('div[part=panel-base]') as HTMLElement;
    onEvent(baseDIV, 'button[part=prevButton],button[part=nextButton], .date-day-item', 'click', (event: Event) => {
      const el = (event as any).delegateTarget as HTMLElement;
      if (el.matches('button[part=prevButton]')) {
        const date = this.innerDate;
        if (this.mode == 'date') {
          date.setMonth(date.getMonth() - 1);
        } else if (this.mode == 'month') {
          date.setFullYear(date.getFullYear() - 1);
        } else if (this.mode == 'year') {
          date.setFullYear(date.getFullYear() - 20);
        }
        panelBase.querySelector('.date-day-item.current')?.classList.remove('current');
        animateCss(panelBase, 'animate-left').then(() => {
          this.innerDate = new Date(+date);
        });
      } else if (el.matches('button[part=nextButton]')) {
        const date = this.innerDate;
        if (this.mode == 'date') {
          date.setMonth(date.getMonth() + 1);
        } else if (this.mode == 'month') {
          date.setFullYear(date.getFullYear() + 1);
        } else if (this.mode == 'year') {
          date.setFullYear(date.getFullYear() + 20);
        }
        panelBase.querySelector('.date-day-item.current')?.classList.remove('current');
        animateCss(panelBase, 'animate-right').then(() => {
          this.innerDate = new Date(+date);
        });
      } else if (el.matches('.date-day-item')) {
        this.value = parseDate((el as any).date as Date, this.mode);
        this.emitValueSelectEvent();
      }
    });
    addEvent(this, 'keydown', (event: KeyboardEvent) => {
      const code = event.key;
      if (this.naviagtorByKeyCode(code)) {
        event.preventDefault();
      }
    });
  }

  naviagtorByKeyCode(keyCode: string) {
    const panelBase = this.renderRoot.querySelector('div[part=panel-base]') as HTMLElement;
    let date = this.valueDate;
    if (!date) {
      date = this.innerDate;
    }
    let set = 0;
    switch (keyCode) {
      case 'ArrowDown':
        set = 1;
        if (this.innerMode == 'year') {
          date.setFullYear(date.getFullYear() + 5);
        } else if (this.innerMode == 'month') {
          date.setMonth(date.getMonth() + 4);
        } else if (this.innerMode == 'date') {
          date.setDate(date.getDate() + 7);
        }
        break;
      case 'ArrowRight':
        set = 1;
        if (this.innerMode == 'year') {
          date.setFullYear(date.getFullYear() + 1);
        } else if (this.innerMode == 'month') {
          date.setMonth(date.getMonth() + 1);
        } else if (this.innerMode == 'date') {
          date.setDate(date.getDate() + 1);
        }
        break;
      case 'ArrowUp':
        set = -1;
        if (this.innerMode == 'year') {
          date.setFullYear(date.getFullYear() - 5);
        } else if (this.innerMode == 'month') {
          date.setMonth(date.getMonth() - 4);
        } else if (this.innerMode == 'date') {
          date.setDate(date.getDate() - 7);
        }
        break;
      case 'ArrowLeft':
        set = -1;
        if (this.innerMode == 'year') {
          date.setFullYear(date.getFullYear() - 1);
        } else if (this.innerMode == 'month') {
          date.setMonth(date.getMonth() - 1);
        } else if (this.innerMode == 'date') {
          date.setDate(date.getDate() - 1);
        }
        break;
      default:
        break;
    }
    if (set != 0 && date) {
      const dateStr = getResouceValue('date.showHeaderStr')(this.innerDate, this.innerMode) as string;
      const newDateStr = getResouceValue('date.showHeaderStr')(date, this.innerMode) as string;
      if (newDateStr != dateStr) {
        panelBase.querySelector('.date-day-item.current')?.classList.remove('current');
        animateCss(panelBase, set > 0 ? 'animate-right' : 'animate-left').then(() => {
          this.value = parseDate(date as Date, this.mode);
          this.emitValueSelectEvent({ key: keyCode });
        });
      } else {
        this.value = parseDate(date as Date, this.mode);
        this.emitValueSelectEvent({ key: keyCode });
      }
    }
    return set != 0;
  }
  render() {
    return html`<div class="date-base" part="base">
      <div class="date-head">${this.renderHeader()}</div>
      <div part="panel-base">
        ${this.innerMode == 'date' ? html`<div part="date-date" class="date-panel date-date ">${this.renderDatePanel()}</div>` : nothing}
        ${this.innerMode == 'month' ? html`<div part="date-month" class="date-panel date-month">${this.renderMonthBody()}</div>` : nothing}
        ${this.innerMode == 'year' ? html`<div part="date-year" class="date-panel date-year ">${this.renderYearBody()}</div>` : nothing}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-date-panel': SlDatePanel;
  }
}
