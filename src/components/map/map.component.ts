import { html } from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './map.styles';
// @ts-ignore
import {map, tileLayer, popup} from 'leaflet'

/**
 * @since 2.0
 * @status experimental
 * @viur 0.5
 *
 * @slot - The default slot.
 * @slot example - add Poi in this slot.
 *
 * @csspart base - The component's map wrapper.
 */
@customElement('sl-map')
export default class SlMap extends ShoelaceElement {
  static styles = styles;
  @query('#map') mapWrapper: HTMLElement;
  mapInstance:any
  popup:any
  boundShowPositionInfo:any

  /** mapbox apikey */
  @property({ type: String, reflect: true }) apikey = '';

  /** Use MapBox api for adresses */
  @property({ type: Boolean, reflect: true }) showAddress = true;

  /** Start latitude */
  @property({ type: Number, reflect: true }) latitude = 51.515;

   /** Start longitude */
  @property({ type: Number, reflect: true }) longitude = 7.465;

  addOpenStreetMapLayer(){
    tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+this.apikey, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: this.apikey
    }).addTo(this.mapInstance);
  }

  showPositionInfo(e:any){
    async function getPlace(lng:number,lat:number,apikey:string){
      const placeURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
      let params ='?types=address&limit=1&access_token='+apikey
      return await fetch(placeURL+lng+","+lat+".json"+params)
    }
    if (this.showAddress){
      getPlace(e.latlng.lng,e.latlng.lat,this.apikey).then(res=>res.json()).then(data=>{
        this.popup = popup().setLatLng(e.latlng)
          .setContent(data["features"][0]["place_name"].replaceAll(",","<br>"))
          this.popup.openOn(e.target);
      })
    }else{
       this.popup = popup().setLatLng(e.latlng)
          .setContent("Geographic position: " + e.latlng.toString())
          this.popup.openOn(e.target);
    }
  }

  firstUpdated(){
    this.mapInstance = map(this.mapWrapper)
    this.mapInstance.setView([this.latitude, this.longitude], 13)
    this.addOpenStreetMapLayer()

    this.boundShowPositionInfo = this.showPositionInfo.bind(this);
    this.mapInstance.on("click", this.boundShowPositionInfo)
  }

  render() {
    return html`<div part="base" id="map"></div><slot></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-map': SlMap;
  }
}
