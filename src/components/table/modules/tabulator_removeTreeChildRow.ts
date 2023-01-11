import {ReactiveDataModule} from '../tabulator_esm.js';

class CustomReactiveDataModule extends ReactiveDataModule {
  watchTreeChildren(row) {
    super.watchTreeChildren(row)
    var self = this,
      childField = row.getData()[this.table.options.dataTreeChildField],
      origFuncs = {};
    if (childField) {
      origFuncs.splice = childField.splice;
      Object.defineProperty(childField, "splice", {
        enumerable: false,
        configurable: true,
        value: (idx, len, obj) => {
          if (!self.blocked) { // fixme pausetracking not work

            self.block("tree-splice");
            const tmp = Array.from(childField);
            if (obj === undefined) {

              var result = tmp.splice(idx, len);

            } else {
              var result = tmp.splice(idx, len, obj);
            }
            const field = this.table.options.dataTreeChildField;
            row.getComponent().update({[field]: tmp}).then(() => {
              this.rebuildTree(row);
              self.unblock("tree-splice");
            })

          } else {
            console.error(`Tree:Splice failed blocked:${self.blocked}`)
            console.error(`origFuncs:${childField} ${typeof (childField)}`)

          }

          return result;
        }
      });

    }
  }


}


export {CustomReactiveDataModule};
