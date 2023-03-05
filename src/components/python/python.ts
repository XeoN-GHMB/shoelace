import {html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import ShoelaceElement from '../../internal/shoelace-element';
import {watch} from '../../internal/watch';
import {LocalizeController} from '../../utilities/localize';
import styles from './python.styles';
import type {CSSResultGroup} from 'lit';
import {usePython} from "usepython-dev";
import {addLogger, removeLogger} from "./log";
import {addDialogHandler, removeDialogHandler} from "./dialog";
import {atom} from 'nanostores'

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
  baseCode = "from scriptor import print, init as __scriptor__init\nawait __scriptor__init()\n";
  py = null;
  outElement = document.createElement("div");
  isLoading = false;
  isExecuting = false;
  idx = 0;
  scriptRunnerTab = '';
  eventMap = {};
  unbindLogListener = null;
  unbindDialogListener = null;

  /** An example attribute. */
  @property({type: String, reflect: true}) code = null;
  @property({type: String, reflect: true}) name = null;

  @watch('code')
  codeChange() {
  }


  async loadPython() {
    if (window.hasUsePython === undefined) {
      window.hasUsePython = true;
      window.usePython = usePython();
      window.globalStore = atom<Array<Object>>([]);

      this.py = window.usePython;

      this.isLoading = true;
      console.log("this.py.isExecuting", this.py.isExecuting.get())
      await this.py.load();
      let baseUrl: string = "http://localhost:8080/";


      await this.runSave(`with open("config.py", "w") as f:\n\tf.write("BASE_URL='${baseUrl}'")`);
      const zipUrl = new URL('http://localhost:8081/src/assets/scriptor.zip').href//todo

      console.log("zipUrl:", zipUrl);

      // Loading scriptor library
      await this.runSave(`
		  from pyodide.http import pyfetch
		  response = await pyfetch("${zipUrl}")
		  await response.unpack_archive()
	   `);

      this.isLoading = false;
      window.globalStore.set({ready: true});
    } else {
      console.log("globalStore", window.globalStore.get())
      return new Promise((_resolve, _reject) => {
        if (window.globalStore.get().ready) {
          this.py = window.usePython;
          _resolve();
          return
        }
        window.globalStore.listen(async (v) => {
          if (!v.ready) {
            return;
          }
          this.py = window.usePython;
          console.log("global store change", v, this.py.isReady.get())
          if (!this.py.isReady.get()) {
            await new Promise((resolve, reject) => {
              this.py.isReady.listen((ready) => {

                if (ready) {
                  resolve();
                }
              })
            })
            await new Promise((resolve, reject) => {
              this.py.isExecuting.listen((exec) => {

                if (!exec) {
                  resolve();
                }
              })
            })
            _resolve();

            console.log("is loaded 2", this.py.isReady.get());
            return
          }
          _resolve();
          return
        });

      });
    }
  }

  async run() {
    this.loadPython().then(async () => {
      console.log("python LOADED !!!!!!!!!")

      //adddialogHandler(this.py, this.outElement);

      //const script = `import scriptor\nprint("13")\nawait scriptor.dialog.confirm("13")\nprint("Weiter")\n`
      console.log("this.py.isExecuting", this.py.isExecuting.get())
      if (this.code !== null) {
        await this.runSave(this.baseCode + this.code);
      }
    });


    //adddialogHandler(this.py, this.outElement);
  }

  runSave(code: string) {
    return new Promise(async (resolve, reject) => {

        if (!this.py.isExecuting.get()) // Nothing is running we can run
        {
          addLogger(this.py, this.outElement, this);
          addDialogHandler(this.py, this.outElement, this);
          console.log("try run save 1", code)
          await this.py.run(code);
          console.log("run code ")

          this.py.pyLogging.set([]);
          this.py.pyDialogs.set([]);
          removeLogger(this);
          removeDialogHandler(this);
          resolve();
        } else {

          // wait for other programm
          await new Promise(async (inner_resolve, inner_reject) => {
              this.py.isExecuting.listen((isExec) => {
                if (!isExec) {
                  inner_resolve()
                }
              });
            }
          );
          addLogger(this.py, this.outElement, this);
          addDialogHandler(this.py, this.outElement, this);
          console.log("try run save 2", code, this.py.isExecuting.get())
          await this.py.run(code);
          console.log("run code ")

          this.py.pyLogging.set([]);
          this.py.pyDialogs.set([]);
          removeLogger(this);
          removeDialogHandler(this);
          resolve();


          
          // await this.py.run(this.baseCode + this.code);
        }
      }
    );

  }

  render() {
    this.outElement.classList.add("output-wrapper")
    return html`${this.outElement}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-python': SlPython;
  }
}
