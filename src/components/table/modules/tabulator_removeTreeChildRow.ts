import {Tabulator, DataTreeModule, RowComponent} from '../tabulator_esm.js';

class CustomDataTree extends DataTreeModule {
  constructor(table: Tabulator) {
    super(table);
    this.registerComponentFunction("row", "removeTreeChild", this.removeTreeChildRow.bind(this));

  }
  removeTreeChildRow(row:RowComponent,  index:number){
		var childIndex = false;


		if(!Array.isArray(row.data[this.field])){
			row.data[this.field] = [];

			row.modules.dataTree.open = this.startOpen(row.getComponent(), row.modules.dataTree.index);
		}

		if(typeof index !== "undefined"){

				row.data[this.field].splice(index, 1 );

		}

		this.initializeRow(row);
		this.layoutRow(row);

		this.refreshData(true);
	}



}


export {CustomDataTree};
