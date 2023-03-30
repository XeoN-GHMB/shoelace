import { css } from 'lit';
import componentStyles from '../../styles/component.styles';
//language=CSS
export default css`
  ${componentStyles}
  :host {
    display: block;
    --table-head-background: var(--sl-color-primary-500);
    --table-head-color: var(--sl-color-neutral-100);

    --table-head-background-hover: rgba(0, 0, 0, .2);
    --table-head-color-hover: #fff;
    --table-row-color-hover: rgba(0, 0, 0, .2);
    --table-row-color-selected: rgba(0, 0, 0, .2);
    --table-border-color: var(--sl-color-neutral-400);
    --table-checkbox-color: var(--sl-color-primary-500);
  }

  .tabulator {
    position: relative;
    border: 1px solid var(--sl-color-neutral-400);
    font-size: 14px;
    text-align: left;
    overflow: hidden;
    -webkit-transform: translatez(0);
    -moz-transform: translatez(0);
    -ms-transform: translatez(0);
    -o-transform: translatez(0);
    transform: translatez(0);
  }

  .tabulator[tabulator-layout="fitDataFill"] .tabulator-tableholder .tabulator-table {
    min-width: 100%;
  }

  .tabulator[tabulator-layout="fitDataTable"] {
    display: inline-block;
  }

  .tabulator.tabulator-block-select {
    user-select: none;
  }

  .tabulator .tabulator-header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    color: var(--sl-color-neutral-800);
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }

  .tabulator .tabulator-header.tabulator-header-hidden {
      display: none;
    }

  .tabulator .tabulator-header .tabulator-header-contents {
    position: relative;
    overflow: hidden;
  }

  .tabulator .tabulator-header .tabulator-header-contents .tabulator-headers {
    display: inline-flex;
  }

  .tabulator .tabulator-header .tabulator-col {
    display: inline-flex;
    position: relative;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: flex-start;
    text-align: left;
    vertical-align: bottom;
    overflow: hidden;
    border-right: none;
    background-color: var(--table-head-background);
  }

  .tabulator .tabulator-header .tabulator-col:hover .tabulator-col-sorter{
    opacity: 1 !important;
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-moving {
    position: absolute;
    border: 1px solid #999;
    background: #dae1e7;
    pointer-events: none;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-col-content {
    display: flex;
    box-sizing: border-box;
    position: relative;
    padding: 4px;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button {
    padding: 0 8px;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button:hover {
    cursor: pointer;
    opacity: .6;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title-holder {
    width: 100%;
    position: relative;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-title-editor {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #999;
    padding: 1px;
    background: #fff;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-header-popup-button + .tabulator-title-editor {
    width: calc(100% - 22px);
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 4px;
    opacity: 0;
    transition: all ease .3s;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid var(--table-head-color);
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols {
    position: relative;
    display: flex;
    border-top: 1px solid #ddd;
    overflow: hidden;
    margin-right: -1px;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-header-filter {
    position: relative;
    box-sizing: border-box;
    margin-top: 2px;
    width: 100%;
    text-align: center;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-header-filter textarea {
    height: auto !important;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-header-filter svg {
    margin-top: 3px;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-header-filter input::-ms-clear {
    width: 0;
    height: 0;
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title {
    padding-right: 70px;
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-sortable:hover {
    cursor: pointer;
    background-color: var(--table-head-background-hover);
    color: var(--table-head-color-hover);
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-col-sorter {
    color: #bbb;
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow {
    border-top: none;
    border-bottom: 6px solid var(--table-head-color);
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="asc"] .tabulator-col-content .tabulator-col-sorter {
    color: var(--sl-color-neutral-500);
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="asc"] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow {
    border-top: none;
    border-bottom: 6px solid var(--table-head-color-hover);
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-col-sorter {
    color: var(--sl-color-neutral-500);
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow {
    border-bottom: none;
    border-top: 6px solid var(--table-head-color-hover);
    color: var(--sl-color-neutral-500);
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-col-vertical .tabulator-col-content .tabulator-col-title {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-col-vertical-flip .tabulator-col-title {
    transform: rotate(180deg);
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-title {
    padding-right: 0;
    padding-top: 20px;
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable.tabulator-col-vertical-flip .tabulator-col-title {
    padding-right: 0;
    padding-bottom: 20px;
  }

  .tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-sorter {
    justify-content: center;
    left: 0;
    right: 0;
    top: 4px;
    bottom: auto;
  }

  .tabulator .tabulator-header .tabulator-frozen {
    display: inline-block;
    position: absolute;
    z-index: 10;
  }

  .tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-left {
    border-right: 2px solid #ddd;
  }

  .tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-right {
    border-left: 2px solid #ddd;
  }

  .tabulator .tabulator-header .tabulator-calcs-holder {
    box-sizing: border-box;
    min-width: 600%;
    background: white !important;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
  }

  .tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle {
    display: none;
  }

  .tabulator .tabulator-header .tabulator-frozen-rows-holder {
    min-width: 600%;
  }

  .tabulator .tabulator-header .tabulator-frozen-rows-holder:empty {
    display: none;
  }

  .tabulator .tabulator-tableholder {
    position: relative;
    width: 100%;
    white-space: nowrap;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tabulator .tabulator-tableholder::-webkit-scrollbar-track {
      background-color: transparent;
  }

  .tabulator .tabulator-tableholder::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: transparent;
  }

  .tabulator .tabulator-tableholder::-webkit-scrollbar-thumb {
      background-color: var(--sl-scrollbar-color);
      border-radius: 3px;
  }

  .tabulator .tabulator-tableholder::-webkit-scrollbar-button {
      height: 6px;
  }

  .tabulator .tabulator-tableholder:focus {
    outline: none;
  }

  .tabulator .tabulator-tableholder .tabulator-placeholder {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .tabulator .tabulator-tableholder .tabulator-placeholder[tabulator-render-mode="virtual"] {
    min-height: 100%;
    min-width: 100%;
  }

  .tabulator .tabulator-tableholder .tabulator-placeholder .tabulator-placeholder-contents {
    display: inline-block;
    text-align: center;
    padding: 10px;
    color: #ccc;
    font-weight: bold;
    font-size: 20px;
    white-space: normal;
  }

  .tabulator .tabulator-tableholder .tabulator-table {
    position: relative;
    display: inline-block;
    background-color: #fff;
    white-space: nowrap;
    overflow: visible;
    color: #333;
    min-width: 100%;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs {
    font-weight: bold;
    background: #e2e2e2 !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-top {
    border-bottom: 2px solid #ddd;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-bottom {
    border-top: 2px solid #ddd;
  }

  .tabulator .tabulator-headers{
    display: flex;
  }

  .tabulator .tabulator-footer {
    border-top: 1px solid #999;
    background-color: #fff;
    color: #555;
    font-weight: bold;
    white-space: nowrap;
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }

  .tabulator .tabulator-footer .tabulator-footer-contents {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
  }

  .tabulator .tabulator-footer .tabulator-footer-contents:empty {
    display: none;
  }

  .tabulator .tabulator-footer .tabulator-calcs-holder {
    box-sizing: border-box;
    width: calc(100% + 20px);
    text-align: left;
    background: white !important;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    overflow: hidden;
  }

  .tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row {
    background: white !important;
  }

  .tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle {
    display: none;
  }

  .tabulator .tabulator-footer .tabulator-calcs-holder:only-child {
    margin-bottom: -5px;
    border-bottom: none;
  }

  .tabulator .tabulator-footer > * + .tabulator-page-counter {
    margin-left: 10px;
  }

  .tabulator .tabulator-footer .tabulator-page-counter {
    font-weight: normal;
  }

  .tabulator .tabulator-footer .tabulator-paginator {
    flex: 1;
    text-align: right;
    color: #555;
    font-family: inherit;
    font-weight: inherit;
    font-size: inherit;
  }

  .tabulator .tabulator-footer .tabulator-page-size {
    display: inline-block;
    margin: 0 5px;
    padding: 2px 5px;
    border: 1px solid #aaa;
    border-radius: 3px;
  }

  .tabulator .tabulator-footer .tabulator-pages {
    margin: 0 7px;
  }

  .tabulator .tabulator-footer .tabulator-page {
    display: inline-block;
    margin: 0 2px;
    padding: 2px 5px;
    border: 1px solid #aaa;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.2);
  }

  .tabulator .tabulator-footer .tabulator-page.active {
    color: #d00;
  }

  .tabulator .tabulator-footer .tabulator-page:disabled {
    opacity: .5;
  }

  .tabulator .tabulator-footer .tabulator-page:not(.disabled):hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
  }

  .tabulator .tabulator-col-resize-handle {
    position: relative;
    display: flex;
    width: 6px;
    margin-left: -3px;
    margin-right: -3px;
    z-index: 10;
    vertical-align: middle;
    height: auto !important;
    transition: all ease .3s;
  }

  .tabulator .tabulator-col-resize-handle:hover {
    cursor: ew-resize;
    border-right: 1px solid var(--table-border-color);
  }

  .tabulator .tabulator-col-resize-handle:last-of-type {
    width: 3px;
    margin-right: 0;
  }

  .tabulator .tabulator-alert {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    z-index: 100;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    text-align: center;
  }

  .tabulator .tabulator-alert .tabulator-alert-msg {
    display: inline-block;
    margin: 0 auto;
    padding: 10px 20px;
    border-radius: 10px;
    background: #fff;
    font-weight: bold;
    font-size: 16px;
  }

  .tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-msg {
    border: 4px solid #333;
    color: #000;
  }

  .tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-error {
    border: 4px solid #D00;
    color: #590000;
  }

  .tabulator-row {
    display: flex;
    position: relative;
    box-sizing: border-box;
    min-height: 22px;
    border-bottom: 1px solid var(--table-border-color);
    transition: background-color ease .3s;
  }

  .tabulator-row.tabulator-row-even {
    background-color: rgb(0, 0, 0, .1);
  }

  .tabulator-row.tabulator-selectable:hover {
    background-color: var(--table-row-color-hover);
    cursor: pointer;
  }

  .tabulator-row.tabulator-selectable:hover .tabulator-data-tree-branch{
    border-color: var(--sl-color-neutral-600);
  }

  .tabulator-row.tabulator-selected {
    background-color: var(--table-row-color-hover) !important;
  }

  .tabulator-row.tabulator-selected .tabulator-data-tree-branch{
    border-color: var(--sl-color-primary-500) !important;
  }

  .tabulator-row.tabulator-selected .tabulator-collapse-chevron sl-icon{
    color: var(--sl-color-primary-500) !important;
  }

  .tabulator-row.tabulator-selected:hover {
    background-color: var(--table-row-color-hover) !important;
    cursor: pointer;
  }

  .tabulator-row.tabulator-row-moving {
    border: 1px solid #000;
    background: #fff;
  }

  .tabulator-row.tabulator-moving {
    position: absolute;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    pointer-events: none;
    z-index: 15;
  }

  .tabulator-row .tabulator-row-resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 5px;
  }

  .tabulator-row .tabulator-row-resize-handle.prev {
    top: 0;
    bottom: auto;
  }

  .tabulator-row .tabulator-row-resize-handle:hover {
    cursor: ns-resize;
  }

  .tabulator-row .tabulator-frozen {
    display: inline-block;
    position: absolute;
    background-color: inherit;
    z-index: 10;
  }

  .tabulator-row .tabulator-frozen.tabulator-frozen-left {
    border-right: 2px solid #ddd;
  }

  .tabulator-row .tabulator-frozen.tabulator-frozen-right {
    border-left: 2px solid #ddd;
  }

  .tabulator-row .tabulator-responsive-collapse {
    box-sizing: border-box;
    padding: 5px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }

  .tabulator-row .tabulator-responsive-collapse:empty {
    display: none;
  }

  .tabulator-row .tabulator-responsive-collapse table {
    font-size: 14px;
  }

  .tabulator-row .tabulator-responsive-collapse table tr td {
    position: relative;
  }

  .tabulator-row .tabulator-responsive-collapse table tr td:first-of-type {
    padding-right: 10px;
  }

  .tabulator-row .tabulator-cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    padding: 4px;
    border-right: 1px solid #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 36px;
    height: auto !important;
    color: var(--sl-foreground-color);
    border-right: 1px solid var(--table-border-color);
    padding: var(--sl-spacing-x-small);
    vertical-align: middle;
  }

  .tabulator.celled .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell {
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
  }

  .tabulator-row .tabulator-cell sl-bone{
    flex: 1;
    display: flex;
  }

  .tabulator-row .tabulator-cell sl-bone{
    display: flex;
    flex-direction: column;
  }

  .tabulator-row .tabulator-cell sl-bone::part(bonevalue){
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    width: 100%;
  }

  .tabulator-row .tabulator-cell.tabulator-editing {
    border: 1px solid var(--sl-color-primary-500);
    outline: none;
    padding: 0;
  }

  .tabulator-row .tabulator-cell.tabulator-editing input,
  .tabulator-row .tabulator-cell.tabulator-editing select {
    border: 1px;
    background: transparent;
    outline: none;
  }

  .tabulator-row .tabulator-cell.tabulator-validation-fail {
    border: 1px solid var(--sl-color-danger-500);
  }

  .tabulator-row .tabulator-cell.tabulator-validation-fail input,
  .tabulator-row .tabulator-cell.tabulator-validation-fail select {
    border: 1px;
    background: transparent;
    color: var(--sl-color-danger-500);
  }

  .tabulator-row .tabulator-cell.tabulator-row-handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    cursor: move;
  }

  .tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box {
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: .3;
    transition: all ease .3s;
  }

  .tabulator-row:hover .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box {
    opacity: 1;
  }

  .tabulator-row .tabulator-cell .tabulator-data-tree-branch {
    display: inline-block;
    vertical-align: middle;
    height: 9px;
    min-width: 7px;
    margin-top: -8px;
    transform: translate(5px, 0);
    border-bottom-left-radius: 1px;
    border-left: 1px solid var(--table-border-color);
    border-bottom: 1px solid var(--table-border-color);
    transition: all ease .3s;
  }

  .tabulator-row .tabulator-cell .tabulator-data-tree-control {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    height: 11px;
    width: 11px;
    margin-right: 5px;
    border: 1px solid #333;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .tabulator-row .tabulator-cell .tabulator-data-tree-control:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
  }

  .tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse {
    display: inline-block;
    position: relative;
    height: 7px;
    width: 1px;
    background: transparent;
  }

  .tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after {
    position: absolute;
    content: "";
    left: -3px;
    top: 3px;
    height: 1px;
    width: 7px;
    background: #333;
  }

  .tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand {
    display: inline-block;
    position: relative;
    height: 7px;
    width: 1px;
    background: #333;
  }

  .tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand:after {
    position: absolute;
    content: "";
    left: -3px;
    top: 3px;
    height: 1px;
    width: 7px;
    background: #333;
  }

  .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    height: 15px;
    width: 15px;
    border-radius: 20px;
    background: var(--sl-color-neutral-500);
    color: #fff;
    font-weight: bold;
    font-size: 1.1em;
  }

  .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle:hover {
    opacity: .7;
  }

  .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-close {
    display: initial;
  }

  .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-open {
    display: none;
  }

  .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle .tabulator-responsive-collapse-toggle-close {
    display: none;
  }

  .tabulator-row .tabulator-cell .tabulator-traffic-light {
    display: inline-block;
    height: 14px;
    width: 14px;
    border-radius: 14px;
  }

  .tabulator-row.tabulator-group {
    box-sizing: border-box;
    border-bottom: 1px solid #999;
    border-right: 1px solid #ddd;
    border-top: 1px solid #999;
    padding: 5px;
    padding-left: 10px;
    background: #ccc;
    font-weight: bold;
    min-width: 100%;
  }

  .tabulator-row.tabulator-group:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .tabulator-row.tabulator-group.tabulator-group-visible .tabulator-arrow {
    margin-right: 10px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid var(--sl-color-neutral-500);
    border-bottom: 0;
  }

  .tabulator-row.tabulator-group.tabulator-group-level-1 {
    padding-left: 30px;
  }

  .tabulator-row.tabulator-group.tabulator-group-level-2 {
    padding-left: 50px;
  }

  .tabulator-row.tabulator-group.tabulator-group-level-3 {
    padding-left: 70px;
  }

  .tabulator-row.tabulator-group.tabulator-group-level-4 {
    padding-left: 90px;
  }

  .tabulator-row.tabulator-group.tabulator-group-level-5 {
    padding-left: 110px;
  }

  .tabulator-row.tabulator-group .tabulator-group-toggle {
    display: inline-block;
  }

  .tabulator-row.tabulator-group .tabulator-arrow {
    display: inline-block;
    width: 0;
    height: 0;
    margin-right: 16px;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 0;
    border-left: 6px solid var(--sl-color-neutral-500);
    vertical-align: middle;
  }

  .tabulator-row.tabulator-group span {
    margin-left: 10px;
    color: #d00;
  }

  .tabulator-popup-container {
    position: absolute;
    display: inline-block;
    box-sizing: border-box;
    background-color: var(--sl-background-color) !important;
    color: var(--sl-foreground-color);
    border: 1px solid #ddd;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
    font-size: 14px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    z-index: 10000;
  }

  .tabulator-popup {
    padding: 5px;
    border-radius: 3px;
  }

  .tabulator-tooltip {
    max-width: Min(500px, 100%);
    padding: 3px 5px;
    border-radius: 2px;
    box-shadow: none;
    font-size: 12px;
    pointer-events: none;
  }

  .tabulator-menu .tabulator-menu-item {
    position: relative;
    box-sizing: border-box;
    padding: 5px 10px;
    user-select: none;
  }

  .tabulator-menu .tabulator-menu-item.tabulator-menu-item-disabled {
    opacity: .5;
  }

  .tabulator-menu .tabulator-menu-item:not(.tabulator-menu-item-disabled):hover {
    cursor: pointer;
    background-color: var(--sl-hover-color) !important;
  }

  .tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu {
    padding-right: 25px;
  }

  .tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu::after {
    display: inline-block;
    position: absolute;
    top: calc(5px + .4em);
    right: 10px;
    height: 7px;
    width: 7px;
    content: '';
    border-width: 1px 1px 0 0;
    border-style: solid;
    border-color: #ddd;
    vertical-align: top;
    transform: rotate(45deg);
  }

  .tabulator-menu .tabulator-menu-separator {
    border-top: var(--table-border-color);
  }

  .tabulator-edit-list {
    max-height: 200px;
    font-size: 14px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tabulator-edit-list .tabulator-edit-list-item {
    padding: 4px;
    color: #333;
    outline: none;
  }

  .tabulator-edit-list .tabulator-edit-list-item.active {
    color: #fff;
    background: #1D68CD;
  }

  .tabulator-edit-list .tabulator-edit-list-item.active.focused {
    outline: 1px solid rgba(255, 255, 255, 0.5);
  }

  .tabulator-edit-list .tabulator-edit-list-item.focused {
    outline: 1px solid #1D68CD;
  }

  .tabulator-edit-list .tabulator-edit-list-item:hover {
    cursor: pointer;
    color: #fff;
    background: #1D68CD;
  }

  .tabulator-edit-list .tabulator-edit-list-placeholder {
    padding: 4px;
    color: #333;
    text-align: center;
  }

  .tabulator-edit-list .tabulator-edit-list-group {
    border-bottom: 1px solid #ddd;
    padding: 4px;
    padding-top: 6px;
    color: #333;
    font-weight: bold;
  }

  .tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-2,
  .tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-2 {
    padding-left: 12px;
  }

  .tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-3,
  .tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-3 {
    padding-left: 20px;
  }

  .tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-4,
  .tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-4 {
    padding-left: 28px;
  }

  .tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-5,
  .tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-5 {
    padding-left: 36px;
  }

  .tabulator.tabulator-ltr {
    direction: ltr;
  }

  .tabulator.tabulator-rtl {
    text-align: initial;
    direction: rtl;
  }

  .tabulator.tabulator-rtl .tabulator-header .tabulator-col {
    text-align: initial;
    border-left: 1px solid #ddd;
    border-right: initial;
  }

  .tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols {
    margin-right: initial;
    margin-left: -1px;
  }

  .tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title {
    padding-right: 0;
    padding-left: 25px;
  }

  .tabulator.tabulator-rtl .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter {
    left: 8px;
    right: initial;
  }

  .tabulator.tabulator-rtl .tabulator-row .tabulator-cell {
    border-right: initial;
    border-left: 1px solid var(--table-border-color);
  }

  .tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-branch {
    margin-right: initial;
    margin-left: 5px;
    border-bottom-left-radius: initial;
    border-bottom-right-radius: 1px;
    border-left: initial;
    border-right: 2px solid var(--table-border-color);
  }

  .tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-control {
    margin-right: initial;
    margin-left: 5px;
  }

  .tabulator-print-fullscreen {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000;
  }

  body.tabulator-print-fullscreen-hide > *:not(.tabulator-print-fullscreen) {
    display: none !important;
  }

  .tabulator-print-table {
    border-collapse: collapse;
  }

  .tabulator-print-table .tabulator-data-tree-branch {
    display: inline-block;
    vertical-align: middle;
    height: 9px;
    width: 7px;
    margin-top: -9px;
    margin-right: 5px;
    border-bottom-left-radius: 1px;
    border-left: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
  }

  .tabulator-print-table .tabulator-print-table-group {
    box-sizing: border-box;
    border-bottom: 1px solid #999;
    border-right: 1px solid #ddd;
    border-top: 1px solid #999;
    padding: 5px;
    padding-left: 10px;
    background: #ccc;
    font-weight: bold;
    min-width: 100%;
  }

  .tabulator-print-table .tabulator-print-table-group:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .tabulator-print-table .tabulator-print-table-group.tabulator-group-visible .tabulator-arrow {
    margin-right: 10px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid var(--sl-color-neutral-500);
    border-bottom: 0;
  }

  .tabulator-print-table .tabulator-print-table-group.tabulator-group-level-1 td {
    padding-left: 30px !important;
  }

  .tabulator-print-table .tabulator-print-table-group.tabulator-group-level-2 td {
    padding-left: 50px !important;
  }

  .tabulator-print-table .tabulator-print-table-group.tabulator-group-level-3 td {
    padding-left: 70px !important;
  }

  .tabulator-print-table .tabulator-print-table-group.tabulator-group-level-4 td {
    padding-left: 90px !important;
  }

  .tabulator-print-table .tabulator-print-table-group.tabulator-group-level-5 td {
    padding-left: 110px !important;
  }

  .tabulator-print-table .tabulator-print-table-group .tabulator-group-toggle {
    display: inline-block;
  }

  .tabulator-print-table .tabulator-print-table-group .tabulator-arrow {
    display: inline-block;
    width: 0;
    height: 0;
    margin-right: 16px;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 0;
    border-left: 6px solid var(--sl-color-neutral-500);
    vertical-align: middle;
  }

  .tabulator-print-table .tabulator-print-table-group span {
    margin-left: 10px;
    color: #d00;
  }

  .tabulator-print-table .tabulator-data-tree-control {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    height: 11px;
    width: 11px;
    margin-right: 5px;
    border: 1px solid #333;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .tabulator-print-table .tabulator-data-tree-control:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
  }

  .tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse {
    display: inline-block;
    position: relative;
    height: 7px;
    width: 1px;
    background: transparent;
  }

  .tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after {
    position: absolute;
    content: "";
    left: -3px;
    top: 3px;
    height: 1px;
    width: 7px;
    background: #333;
  }

  .tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand {
    display: inline-block;
    position: relative;
    height: 7px;
    width: 1px;
    background: #333;
  }

  .tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand:after {
    position: absolute;
    content: "";
    left: -3px;
    top: 3px;
    height: 1px;
    width: 7px;
    background: #333;
  }

  .tabulator {
    display: flex !important;
    flex-direction: column;
    width: 100%;
    height: 100% !important;
    margin: 1em 0em;
    border: 1px solid rgba(34, 36, 38, 0.15);
    box-shadow: none;
    border-radius: 0.28571rem;
    color: var(--sl-color-neutral-800);
  }

  .tabulator .tabulator-header {
    border-right: none;
    border-bottom: 2px solid var(--table-border-color);
    background-color: var(--table-head-background);
    box-shadow: none;
    color: var(--table-head-color);
    font-style: none;
    font-weight: bold;
    text-transform: none;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }

  .tabulator .tabulator-header .tabulator-col .tabulator-col-content {
    padding: 0.6em 0.4em;
  }

  .tabulator .tabulator-tableholder .tabulator-table {
    background-color: transparent;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs {
    background: #f2f2f2 !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-top {
    border-bottom: 2px solid #ddd;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-bottom {
    border-top: 2px solid #ddd;
  }

  .tabulator .tabulator-footer {
    padding: var(--sl-spacing-x-small);
    border-top: 1px solid rgba(34, 36, 38, 0.15);
    box-shadow: none;
    background: #F9FAFB;
    text-align: right;
    color: var(--sl-color-neutral-800);
    font-style: normal;
    font-weight: normal;
    text-transform: none;
  }

  .tabulator .tabulator-footer .tabulator-calcs-holder {
    margin: -var(--sl-spacing-x-small) -var(--sl-spacing-x-small) var(--sl-spacing-x-small) -var(--sl-spacing-x-small);
    background: white !important;
  }

  .tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row {
    background: white !important;
  }

  .tabulator .tabulator-footer .tabulator-calcs-holder:only-child {
    margin-bottom: -var(--sl-spacing-x-small);
    border-bottom: none;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.positive,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.positive {
    box-shadow: 0px 0px 0px #A3C293 inset;
    background: #FCFFF5 !important;
    color: var(--sl-color-success-500) !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.positive:hover,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.positive:hover {
    background: #f7ffe6 !important;
    color: var(--sl-color-success-500) !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.negative,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.negative {
    box-shadow: 0px 0px 0px #E0B4B4 inset;
    background: #FFF6F6 !important;
    color: var(--sl-color-danger-500) !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.negative:hover,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.negative:hover {
    background: #ffe7e7 !important;
    color: var(--sl-color-danger-500) !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.error,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.error {
    box-shadow: 0px 0px 0px #E0B4B4 inset;
    background: #FFF6F6 !important;
    color: var(--sl-color-danger-500) !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.error:hover,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.error:hover {
    background: #ffe7e7 !important;
    color: var(--sl-color-danger-500) !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.warning,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.warning {
    box-shadow: 0px 0px 0px #C9BA9B inset;
    background: #FFFAF3 !important;
    color: var(--sl-color-warning-500) !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.warning:hover,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.warning:hover {
    background: #fff4e4 !important;
    color: var(--sl-color-warning-500) !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.active,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.active {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.87) inset;
    background: #E0E0E0 !important;
    color: var(--sl-color-neutral-800);
  !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.active:hover,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.active:hover {
    background: #f7ffe6 !important;
    color: var(--sl-color-success-500) !important;
  }

  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.active,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row.disabled:hover,
  .tabulator .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell.active {
    pointer-events: none;
    color: rgba(0, 0, 0, 0.2);
  }

  .tabulator.celled {
    border: 1px solid rgba(34, 36, 38, 0.15);
  }

  .tabulator.celled .tabulator-header .tabulator-col {
    border-right: 1px solid rgba(34, 36, 38, 0.1);
  }

  .tabulator[class*="single line"] .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell {
    border-right: none;
  }

  .tabulator.padded .tabulator-header .tabulator-col .tabulator-col-content {
    padding: 1em 1em;
  }

  .tabulator.padded .tabulator-header .tabulator-col .tabulator-col-content .tabulator-arrow {
    top: 20px;
  }

  .tabulator.padded .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell {
    padding: 1em 1em;
  }

  .tabulator.padded.very .tabulator-header .tabulator-col .tabulator-col-content {
    padding: 1.5em 1.5em;
  }

  .tabulator.padded.very .tabulator-header .tabulator-col .tabulator-col-content .tabulator-arrow {
    top: 26px;
  }

  .tabulator.padded.very .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell {
    padding: 1.5em 1.5em;
  }

  .tabulator.compact .tabulator-header .tabulator-col .tabulator-col-content {
    padding: 0.5em 0.7em;
  }

  .tabulator.compact .tabulator-header .tabulator-col .tabulator-col-content .tabulator-arrow {
    top: 12px;
  }

  .tabulator.compact .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell {
    padding: 0.5em 0.7em;
  }

  .tabulator.compact.very .tabulator-header .tabulator-col .tabulator-col-content {
    padding: 0.4em 0.6em;
  }

  .tabulator.compact.very .tabulator-header .tabulator-col .tabulator-col-content .tabulator-arrow {
    top: 10px;
  }

  .tabulator.compact.very .tabulator-tableholder .tabulator-table .tabulator-row .tabulator-cell {
    padding: 0.4em 0.6em;
  }

  .tabulator-row.tabulator-row-even {
    background-color: transparent;
  }

  .tabulator-row.tabulator-selectable:hover {
    background: var(--table-row-color-hover) !important;
    color: var(--sl-color-neutral-800);
  }

  .tabulator-row.tabulator-selected {
    background-color: var(--table-row-color-selected) !important;
    font-weight: 600;
  }

  .tabulator-row.tabulator-selected:hover {
    background-color: var(--table-row-color-selected) !important;
    cursor: pointer;
  }

  .tabulator-row.tabulator-moving {
    pointer-events: none !important;
  }

  .tabulator-row .tabulator-cell.tabulator-root-cell-children{
    padding: 0;
  }

  .tabulator-row .tabulator-cell.tabulator-root-cell-children .tabulator-collapse-chevron{
     padding: var(--sl-spacing-x-small);
  }

  .tabulator-row .tabulator-cell.tabulator-root-cell-children sl-bone{
    padding: var(--sl-spacing-x-small) var(--sl-spacing-x-small) var(--sl-spacing-x-small) 0;
  }

  .tabulator-row .tabulator-cell:last-of-type {
    border-right: none;
  }

  .tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle {
    color: #fff;
  }

  .tabulator-row.tabulator-group span {
    color: var(--sl-color-neutral-500);
  }

  .tabulator-menu {
    background: #FFFFFF;
  }

  .tabulator-menu .tabulator-menu-item:not(.tabulator-menu-item-disabled):hover {
    background: #F9FAFB;
  }

  .tabulator-edit-select-list {
    background: #FFFFFF;
  }

  .tabulator-edit-select-list .tabulator-edit-select-list-item.active {
    color: #FFFFFF;
  }

  .tabulator-edit-select-list .tabulator-edit-select-list-item.active.focused {
    outline: 1px solid rgba(255, 255, 255, 0.5);
  }

  .tabulator-edit-select-list .tabulator-edit-select-list-item:hover {
    color: #FFFFFF;
  }

  .tabulator-edit-select-list .tabulator-edit-select-list-notice {
    color: inherit;
  }

  .tabulator-print-table .tabulator-print-table-group {
    background: #fafafa;
  }

  .tabulator-print-table .tabulator-print-table-group span {
    color: var(--sl-color-neutral-500);
  }
  /*Custom STYLE*/
  .tabulator-row.tabulator-row-disabled div {
    background-color: rgba(159, 159, 159, 0.15);
    opacity: 0.4;
  }

  .tabulator-control-element.control-element-disabled{
     opacity: 0.2;
  }


/*//////////////////////// Hierachy //////////////////////*/

  .tabulator-hierarchy{

  }

  .tabulator-collapse-chevron{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 1.6em;
    padding-right: .4em;
    padding-left: .2em;
    transition: all ease .3s;
  }

  .tabulator-collapse-chevron.expand sl-icon{
    transform: rotate(0deg);
  }

  .tabulator-collapse-chevron sl-icon{
    width: .6em;
    height: .6em;
    color: var(--sl-color-neutral-500);
    transform: rotate(90deg);
  }

  .tabulator-col-placeholder{
    background-color: var(--sl-color-primary-50);
  }

  sl-checkbox::part(label){
    color: var(--sl-foreground-color);
  }

  sl-checkbox::part(control){
    background-color: var(--sl-background-color);
    border: 1px solid var(--table-border-color);
  }

  sl-checkbox::part(control--checked){
    background-color: var(--table-checkbox-color);
    border: 1px solid var(--table-checkbox-color);
  }

  sl-checkbox::part(control--indeterminate){
    background-color: var(--table-checkbox-color);
    border: 1px solid var(--table-checkbox-color);
  }

  sl-checkbox::part(checked-icon){
    width: 0px;
    position: relative;
  }

  sl-checkbox::part(checked-icon)::after{
    content: '';
    position: absolute;
    display: inline-block;
    transform: rotate(45deg);
    height: calc((var(--toggle-size) / 6) * 3);
    width: calc((var(--toggle-size) / 12) * 3);
    margin-left: calc(-0.19 * var(--toggle-size));
    margin-top: calc(0.08 * var(--toggle-size));
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
  }

  sl-checkbox[aria-label="Select Row"]{
    margin: 0 auto;
  }

  sl-checkbox[aria-label="Select Row"]::part(label){
    display: none;
  }

`;
