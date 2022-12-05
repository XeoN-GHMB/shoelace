import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import Component from '../../components/gallery/gallery.js';

export default createComponent(React, 'sl-gallery', Component, {
  onSlGalleryBeforeChange: 'sl-gallery-before-change',
  onSlGalleryChange: 'sl-gallery-change',
  onSlGalleryImageLoad: 'sl-gallery-image-load',
  onSlGalleryImageClick: 'sl-gallery-image-click'
});
