import {html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import ShoelaceElement from '../../internal/shoelace-element';
import {watch} from '../../internal/watch';
import {LocalizeController} from '../../utilities/localize';
import styles from './python.styles';
import type {CSSResultGroup} from 'lit';
import {usePython} from "usepython";

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://shoelace.style/components/python
 * @status experimental
 * @viur 0.5
 * @since 2.0
 *
 * @dependency sl-example
 *
 * @event sl-event-name - Emitted as an example.
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
@customElement('sl-python')
export default class SlPython extends ShoelaceElement {
  static styles: CSSResultGroup = styles;
  py = usePython();
  outElement;
  isLoading = false;
  idx = 0;
  private readonly localize = new LocalizeController(this);

  /** An example attribute. */
  @property() attr = 'example';

  @watch('someProperty')
  doSomething() {
    // Example event
    this.emit('sl-event-name');
  }

  async loadPython() {
    this.isLoading = true;

    await this.py.load();

    let baseUrl: string = "http://localhost:8080/";


    await this.py.run(`with open("config.py", "w") as f:\n\tf.write("BASE_URL='${baseUrl}'")`)

    const zipUrl = new URL('http://localhost:8081/src/assets/scriptor.zip').href//todo

    console.log("zipUrl:", zipUrl);

    // Loading scriptor library
    await this.py.run(`
		  from pyodide.http import pyfetch
		  response = await pyfetch("${zipUrl}")
		  await response.unpack_archive()
	   `)

    this.isLoading = false;
  }

  async runScript() {
    await this.loadPython();
    const self = this;
    this.py.log.listen((val) => {

      const e = document.createElement("div");
      console.log(val.stdOut[self.idx]);
      e.innerText = val.stdOut[self.idx];
      self.outElement.appendChild(e);
      self.idx = val.stdOut.length;


    });
    const script = `
    a=1
    b=2
    print(a+b)
    arne="arne123"
    print(12)
    print("arne")
    print(arne)
    `
    await this.py.run(script);
    console.log("here ? ")
  }

  render() {
    this.outElement = document.createElement("div");
    this.runScript();

    return html`${this.outElement}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-python': SlPython;
  }
}
