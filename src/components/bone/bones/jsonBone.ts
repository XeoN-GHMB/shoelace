// @ts-nocheck
import {BoneValue, RawBone} from "./rawBone";
import {formatstring} from "../utils";
import {html, TemplateResult} from "lit";


import {EditorState} from '@codemirror/state';
import {EditorView} from '@codemirror/view'
import {json, jsonParseLinter} from '@codemirror/lang-json'
import {basicSetup} from "codemirror";


export class JsonBone extends RawBone {
  view(formater: () => BoneValue = formatstring): string | TemplateResult<1> {
    function renderjson(data, boneStructure, lang: string | null = null) {
      return html`
        <pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

    return super.view(renderjson);
  }

  getEditor(value: BoneValue, boneName: string, lang: string | null = null) {
    const wrapper = document.createElement("div");
    const self: RawBone = this;
    let old_value = undefined;
    const state = EditorState.create({
      doc: JSON.stringify(value, null, 2),
      extensions: [basicSetup, json(), EditorView.updateListener.of(function (e) {
        if (e.state.doc !== old_value && old_value !== undefined)// very slow i think ? //todo
        {
          old_value = e.state.doc;
          self.mainInstance.jsonboneCache[boneName] = e.state.doc.toString();
          self.mainInstance.internboneValue = self.reWriteBoneValue();
          self.mainInstance.handleChange();

        } else if (old_value === undefined) {
          old_value = e.state.doc;
        }

      })]
    })
    //state.readOnly=this.boneStructure["readonly"]
    const view = new EditorView({
      state: state, parent: wrapper, root: self.mainInstance.shadowRoot
    });

    wrapper.dataset.jsonbone="true";
    wrapper.dataset.name=boneName;
    return wrapper;
  }
}
