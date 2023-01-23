import {ReactiveDataModule} from '../tabulator_esm.js';

class CustomReactiveDataModule extends ReactiveDataModule {
  //FIXME  ReactiveDataModule not work with vue js reactive data
  watchTreeChildren(row) {
    var self = this,
      childField = row.getData()[this.table.options.dataTreeChildField],
      origFuncs = {};

    if (childField) {

      origFuncs.push = childField.push;

      Object.defineProperty(childField, "push", {
        enumerable: false,
        configurable: true,
        value: (obj) => {
          if (!self.blocked) {
            self.block("tree-push");
            const tmp = Array.from(childField);
            var result = tmp.push(obj);
            const field = this.table.options.dataTreeChildField;
            row.getComponent().update({[field]: tmp}).then(() => {
              this.rebuildTree(row);
              self.unblock("tree-push");
            })


          }

          return result;
        }
      });

      origFuncs.unshift = childField.unshift;

      Object.defineProperty(childField, "unshift", {
        enumerable: false,
        configurable: true,
        value: (obj) => {
          if (!self.blocked) {
            self.block("tree-unshift");
            const tmp = Array.from(childField);
            var result = tmp.unshift(obj);
            const field = this.table.options.dataTreeChildField;
            row.getComponent().update({[field]: tmp}).then(() => {
              this.rebuildTree(row);
              self.unblock("tree-unshift");
            })


          }

          return result;
        }
      });

      origFuncs.shift = childField.shift;

      Object.defineProperty(childField, "shift", {
        enumerable: false,
        configurable: true,
        value: (obj) => {
          if (!self.blocked) {
            self.block("tree-shift");

            const tmp = Array.from(childField);
            var result = tmp.shift(obj);
            const field = this.table.options.dataTreeChildField;
            row.getComponent().update({[field]: tmp}).then(() => {
              this.rebuildTree(row);
              self.unblock("tree-shift");
            })
          }

          return result;
        }
      });

      origFuncs.pop = childField.pop;

      Object.defineProperty(childField, "pop", {
        enumerable: false,
        configurable: true,
        value: () => {
          if (!self.blocked) {
            self.block("tree-pop");


            const tmp = Array.from(childField);
            var result = tmp.pop();
            const field = this.table.options.dataTreeChildField;
            row.getComponent().update({[field]: tmp}).then(() => {
              this.rebuildTree(row);
              self.unblock("tree-pop");
            })
          }

          return result;
        }
      });

      origFuncs.splice = childField.splice;
      Object.defineProperty(childField, "splice", {
        enumerable: false,
        configurable: true,
        value: (idx, len, obj) => {
          console.log("we perform splice")
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
