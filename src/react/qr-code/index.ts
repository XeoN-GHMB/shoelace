import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/qr-code/qr-code.component.js';

const tagName = 'sl-qr-code';
Component.define('sl-qr-code');

/**
 * @summary Generates a [QR code](https://www.qrcode.com/) and renders it using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
 * @documentation https://shoelace.style/components/qr-code
 * @status stable
 * @since 2.0
 *
 * @csspart base - The component's base wrapper.
 */
const reactWrapper = createComponent({
  tagName,
  elementClass: Component,
  react: React,
  events: {},
  displayName: 'SlQrCode'
});

export default reactWrapper;
