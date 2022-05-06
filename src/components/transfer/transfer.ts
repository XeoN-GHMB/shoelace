import { html, LitElement, nothing, render, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { customStyle } from '../../internal/customStyle';
import { emit } from '../../internal/event';
import resourceLocal from '../../internal/resourceLocal';
import { watch } from '../../internal/watch';
import { watchProps } from '../../internal/watchProps';
import { isArray } from '../../utilities/common';
import { getResouceValue } from '../../utilities/getResouce';
import '../checkbox/checkbox';
import SlCheckbox from '../checkbox/checkbox';
import SlInput from '../input/input';
import '../scroll/scroll';
import SlScroll from '../scroll/scroll';
import SlTable from '../table/table';
import styles from './transfer.styles';
type TransferItem = {
  id: string | number /**Primary key, unique within a container */;
  name: string /**Name */;
  [key: string]: unknown /**Other customization options */;
};

const defaultTransfilter = (item: TransferItem, value: string) => {
  if (value == null || value == '' || value.trim() == '' || typeof item.name == 'undefined') {
    return true;
  }
  return item.name.includes(value);
};
/**
 * @since 2.0
 * @status experimental
 *
 * @dependency sl-checkbox,sl-button
 *
 * @event {{sourceSearchValue:string[],targetSearchValue:string[]}} sl-filter-change - Emitted as filter value change.
 * @event {{sourceSelectedKeys:string[]|number,targetSelectedKeys:string[]|number}} sl-transfer-change - Triggered when the selected item changes.
 * @event {{scroll:SlScrll,directtion:source|target}} sl-scroll-item - Triggered when the left and right sides are scrolled vertically.
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 * @csspart container - The component's source,target wrapper.
 * @csspart search - The component's source,target search wraper.
 * @csspart slInput - The component's filter slInput.
 * @csspart input - The component's filter slInput's input.
 * @csspart header - The component's source,target header wraper.
 *
 *
 * @cssproperty --example - An example CSS custom property.
 */
@resourceLocal()
@customStyle()
@customElement('sl-transfer')
export default class SlTransfer extends LitElement {
  static styles = styles;

  /** List of all data sets */
  @property({ attribute: false, reflect: false }) dataSource: TransferItem[];

  /**Customized rendering of data items */
  @property({ attribute: false, reflect: false }) renderItem: (item: TransferItem, direction: 'source' | 'target') => TemplateResult<1>;

  /** The ID of the currently selected data item on the left side of the operation process */
  @state() private sourceTempSelectedKeys: Array<string | number> = [];

  /** The ID of the currently selected data item on the right side during the operation */
  @state() private targetTempSelectedKeys: Array<string | number> = [];

  /** The data set displayed on the right side List of primary keys */
  @property({ type: Array }) targetKeys: Array<string | number> = [];

  /** Whether to disable the selection */
  @property({ type: Boolean }) disabled: boolean = false;

  private cacheDataSource = new Map<string | number, TransferItem>();

  /**Get the data item corresponding to the option based on the Id */
  public getItemById(id: string | number) {
    return this.cacheDataSource.get(id);
  }
  /**Get the list on the right*/
  get targetDataList() {
    const result: TransferItem[] = [];
    for (let key of this.targetKeys) {
      const item = this.cacheDataSource.get(key);
      if (item != null) {
        result.push(item);
      } else {
        console.warn(`key=${key} is not found in dataSouce by id `);
      }
    }
    return result;
  }

  get sourceDataList() {
    const result: TransferItem[] = [];
    if (this.dataSource) {
      for (let item of this.dataSource) {
        const key = item.id;
        if (this.targetKeys && this.targetKeys.includes(key)) {
          continue;
        }
        result.push(item);
      }
    }
    return result;
  }

  @watchProps(['dataSource', 'filterMethod', 'disableFilter', 'targetSearchValue', 'sourceSearchValue'])
  watchDataSourceChanged() {
    this.cacheDataSource.clear();
    if (this.dataSource) {
      for (let item of this.dataSource) {
        this.cacheDataSource.set(item.id, item);
      }
      this.runFilterMethod();
    }
  }

  @state() protected filterTargetDataList: Array<TransferItem> = [];
  @state() protected filterSourceDataList: Array<TransferItem> = [];

  protected runFilterMethod() {
    let list = this.targetDataList;
    if (!this.disableFilter && this.targetSearchValue && this.filterMethod) {
      list = list.filter(item => this.filterMethod(item, ...this.targetSearchValue));
    }
    this.filterTargetDataList = list;
    list = this.sourceDataList;
    if (!this.disableFilter && this.sourceSearchValue && this.filterMethod) {
      list = list.filter(item => this.filterMethod(item, ...this.sourceSearchValue));
    }
    this.filterSourceDataList = list;
  }
  /** Whether to turn off filtering */
  @property({ type: Boolean, attribute: 'disable-filter' }) disableFilter: boolean;
  /** Filter Input's placeholder, if it is a string, it acts on source, target, if it is an array, the first one acts on the left, the second one acts on the right   */
  @property() filterPlaceholder: string | string[];

  /** Custom Title rendering: if it is an array, it is the left and right Title , if it is a function, it receives 'source'|'target' to return the rendered content */
  @property({ attribute: false, reflect: false }) titleTemplate: string[] | ((direct: 'source' | 'target') => TemplateResult<1>);

  /** Whether or not to display the Select All button */
  @property({ type: Boolean }) showSelectAll: boolean = true;

  /**If the data list is to be displayed as a Table , then this property receives 'source|target' to return the table component Template*/
  @property({ type: Object, attribute: false }) tableTemplate: (direction: 'source' | 'target') => TemplateResult<1>;

  /**data filter function, receives two parameters: item: data items, the other for the component binding value: filter value , if the user has customized, can support multiple filter conditions */
  @property({ attribute: false, reflect: false }) filterMethod: (item: TransferItem, ...value: unknown[]) => boolean = defaultTransfilter;

  /**Callback function when the selected item is changed  */
  @property({ attribute: false, reflect: false }) selectChangeCallback: (sourceSelectedKeys: Array<string | number>, targetSelectedKeys: Array<string | number>) => boolean;

  /**
   * Custom filtered html
   */
  @property({ attribute: false })
  customFilterTemplate: (_direction: 'source' | 'target') => TemplateResult<1>;

  /**
   * Custom Checked, Total Description
   */
  @property({ attribute: false })
  customSelectedTiitleTemplate: (selectNumber: number, filterSize: number, totalSize: number) => TemplateResult<1>;

  private renderFilter(_direction: 'source' | 'target') {
    if (this.customFilterTemplate) {
      return this.customFilterTemplate(_direction);
    }
    const placeholder =
      typeof this.filterPlaceholder != 'undefined' ? (isArray(this.filterPlaceholder) ? this.filterPlaceholder[_direction == 'source' ? 0 : 1] : this.filterPlaceholder) : (getResouceValue('seachTransfer') as string);
    return html`<sl-input direction=${_direction} size="small" @sl-input=${(event: Event) => this.doFilterInputHandler(event, _direction)} placeholder=${placeholder} exportparts="base:slInput,input:input" clearable
      ><sl-icon slot="suffix" name="search"></sl-icon
    ></sl-input>`;
  }
  /**
   * If the client has defined a filter template, you need to set the filter criteria manually, using the system filter criteria, which is the input content of the input
   */
  @property({ attribute: false, reflect: false }) protected sourceSearchValue: unknown[] = [];
  @property({ attribute: false, reflect: false }) protected targetSearchValue: unknown[] = [];
  private inputTimeoutID: any;
  private doFilterInputHandler(_event: Event, _direction: 'source' | 'target') {
    const input = _event.target as SlInput;
    this.inputTimeoutID = globalThis.setTimeout(() => {
      globalThis.clearTimeout(this.inputTimeoutID);
      if (_direction == 'source') {
        this.sourceSearchValue[0] = input.value;
      } else {
        this.targetSearchValue[0] = input.value;
      }
      this.sourceSearchValue = [...this.sourceSearchValue];
      this.targetSearchValue = [...this.targetSearchValue];
      this.emitFilterEvent();
    }, 20);
  }
  protected emitFilterEvent() {
    /** Triggering filter events */
    emit(this, 'sl-filter-change', {
      detail: {
        source: this.sourceSearchValue[0],
        target: this.targetSearchValue[0],
        sourceSearchValue: this.sourceSearchValue,
        targetSearchValue: this.targetSearchValue
      }
    });
  }
  protected processSelectItem(event: Event, item: TransferItem, direction: 'source' | 'target') {
    const li = event.currentTarget as HTMLElement;
    const el = li.querySelector('sl-checkbox') as SlCheckbox;
    if (event.target != el) {
      el.click();
    }
    requestAnimationFrame(() => {
      const array = direction == 'source' ? this.sourceTempSelectedKeys : this.targetTempSelectedKeys;
      let index = array.indexOf(item.id);
      if (el.checked && index < 0) {
        array.push(item.id);
      } else if (!el.checked && index >= 0) {
        array.splice(index, 1);
      }
      direction == 'source' ? (this.sourceTempSelectedKeys = [...array]) : (this.targetTempSelectedKeys = [...array]);
      this.dispatchTransferChange();
    });
  }
  dispatchTransferChange() {
    emit(this, 'sl-transfer-change', {
      detail: {
        'sourceSelectedKeys:': this.sourceTempSelectedKeys,
        targetSelectedKeys: this.targetTempSelectedKeys
      }
    });
    if (this.selectChangeCallback) {
      this.selectChangeCallback(this.sourceTempSelectedKeys, this.targetTempSelectedKeys);
    }
  }
  private sourceScrollRef = createRef<SlScroll>();
  private targetScrollRef = createRef<SlScroll>();
  public get sourceScroll() {
    return this.sourceScrollRef.value;
  }
  public get targetScroll() {
    return this.targetScrollRef.value;
  }
  private sourceTable: SlTable;
  private targetTable: SlTable;
  dispatchScrollEvent(event: Event, direction: 'source' | 'target') {
    let scroll = event.target as SlScroll;
    emit(this, 'sl-scroll-item', {
      detail: { scroll, direction: direction }
    });
  }
  @watch('tableTemplate')
  tableTemplateChange() {
    const frag = document.createDocumentFragment();
    render(this.tableTemplate('source'), frag);
    this.sourceTable = frag.firstElementChild as SlTable;
    if (this.sourceTable == null || !(this.sourceTable instanceof SlTable)) {
      throw new Error('tableTemplate should be a function take a parameter string:source|target return Template like html`<sl-table><sl-column></sl-column></sl-table>`');
    }
    this.sourceTable.id = 'sourceTable';
    this.sourceTable.classList.add('table');
    const targetfrag = document.createDocumentFragment();
    render(this.tableTemplate('target'), targetfrag);
    this.targetTable = targetfrag.firstElementChild as SlTable;
    this.targetTable.id = 'targetTable';
    if (this.sourceTable == null || !(this.sourceTable instanceof SlTable)) {
      throw new Error('tableTemplate should be a function take a parameter string:source|target return Template like html`<sl-table><sl-column></sl-column></sl-table>`');
    }
    this.targetTable.classList.add('table');
  }

  protected renderContent(direction: 'source' | 'target') {
    const items = direction == 'source' ? this.filterSourceDataList : this.filterTargetDataList;
    if (this.tableTemplate != undefined) {
      direction == 'source' ? (this.sourceTable.dataSource = items) : (this.targetTable.dataSource = items);
      return html`${direction == 'source' ? this.sourceTable : this.targetTable}`;
    }
    const result = items.map(item => {
      return html`<li class="render-item" part="render-item" @click=${(event: Event) => this.processSelectItem(event, item, direction)}>
        <sl-checkbox
          part="render-checkbox"
          .shape=${'circle'}
          .checked=${live(direction == 'source' ? this.sourceTempSelectedKeys && this.sourceTempSelectedKeys.includes(item.id) : this.targetTempSelectedKeys && this.targetTempSelectedKeys.includes(item.id))}
        >
        </sl-checkbox>
        <div class="render-item-label">${this.renderItem ? this.renderItem(item, direction) : item.name}</div>
      </li>`;
    });
    if (!items || items.length == 0) {
      return html`<div slot=${direction + '-empty'} class="emptyData">${getResouceValue('noData')}</div>`;
    } else {
      return html`<sl-scroll @sl-scroll-y=${(event: Event) => this.dispatchScrollEvent(event, direction)} ${ref(direction == 'source' ? this.sourceScrollRef : this.targetScrollRef)}>${result}</sl-scroll>`;
    }
  }

  public getTempSelecteDataList(direction: 'source' | 'target') {
    const item = direction == 'source' ? this.sourceDataList : this.targetDataList;
    const selectedKeys = direction == 'source' ? this.sourceTempSelectedKeys : this.targetTempSelectedKeys;
    return item.filter(item => selectedKeys.includes(item.id));
  }

  renderTitle(direction: 'source' | 'target') {
    const item = direction == 'source' ? this.filterSourceDataList : this.filterTargetDataList;
    const totalItem = 'source' ? this.sourceDataList : this.targetDataList;
    const selecteItems = this.getTempSelecteDataList(direction);
    const changeSelectAll = (event: Event) => {
      let checkbox = event.target as SlCheckbox;
      let checked = checkbox.checked;
      const selectedKeys = checked ? (direction == 'source' ? this.sourceTempSelectedKeys : this.targetTempSelectedKeys) : [];
      item.forEach(item => {
        let index = selectedKeys.indexOf(item.id);
        if (checked && index < 0) {
          selectedKeys.push(item.id);
        } else if (!checked) {
          selectedKeys.splice(index, 1);
        }
      });
      if (direction == 'source') {
        this.sourceTempSelectedKeys = [...selectedKeys];
      } else {
        this.targetTempSelectedKeys = [...selectedKeys];
      }
    };

    const selectAllTemp = this.showSelectAll
      ? html`<sl-checkbox
          .indeterminate=${item.length > 0 && selecteItems.length > 0 && selecteItems.length < item.length}
          .checked=${item.length > 0 && item.length == selecteItems.length}
          part="selectAll"
          name="${direction}"
          @sl-change=${changeSelectAll}
        ></sl-checkbox>`
      : '';
    let titleHtml = this.titleTemplate ? (isArray(this.titleTemplate) ? html`<span part="title">${this.titleTemplate[direction == 'source' ? 0 : 1]}</span>` : this.titleTemplate(direction)) : '';
    const selectItemSizeHtml = this.customSelectedTiitleTemplate
      ? this.customSelectedTiitleTemplate(selecteItems.length, item.length, totalItem.length)
      : getResouceValue('transferSelectedFun')(selecteItems.length, item.length);
    return html`${selectAllTemp}<span part="selecteItems-span">${selectItemSizeHtml}</span>${titleHtml}`;
  }
  render() {
    return html`<div part='base'>
      <div part='container' class='source' >
        <div part='header'>${this.renderTitle('source')}</div>
        <div part='body'>
          ${!this.disableFilter ? html`<div part="search">${this.renderFilter('source')}</div>` : nothing}
          <div part='body-content'>${this.renderContent('source')}</div>
        </div>
      </div>
      <div part='base-operation'></div>
      <div part='container' class='target'>
        <div part='header'>${this.renderTitle('target')}</div>
        <div part='body'>
            ${!this.disableFilter ? html`<div part="search">${this.renderFilter('target')}</div>` : nothing}
            <div part='body-content'>${this.renderContent('target')}</div>
        </div>
        </div>
      </div>
  </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-transfer': SlTransfer;
  }
}
