
importScripts("https://cdn.jsdelivr.net/pyodide/v0.22.0/full/pyodide.js");

let isPyLoaded = false;


function stdout(msg) {
  self.postMessage({ type: "stdout", msg: msg, id: null })
}

function stderr(msg) {
  self.postMessage({ type: "stderr", msg: msg, id: null })
}

function installLog(id, stage, msg) {
  self.postMessage({
    type: "installlog", msg: {
      stage: stage,
      msg: msg
    }, id: id
  })
}

function err(id, msg) {
  self.postMessage({ type: "err", msg: msg, id: id })
}

function end(id, res) {
  self.postMessage({ type: "end", res: res ?? null, id: id })
}

function run_end(id, res) {
	self.postMessage({ type: "run_end", res: res ?? null, id: id })
}

let manager = {
	allocId: 0, 
	currentProcessId: 0, 
	tasks: {},
	resultValue: null,
	copyResult: function() {
		return structuredClone(this.resultValue); 
	},

	reset: function() {
		this.resultValue = undefined; 
	},

	intervalEvent: null,
	sleep: async function sleep(time) {
		return new Promise((resolve, _) => setTimeout(resolve, time))
	  }
}

async function loadPyodideAndPackages(id, pyoPackages, packages, initCode, transformCode) {
  installLog(id, 1, "Loading python runtime")
  self.pyodide = await loadPyodide({
    stdout: stdout,
    stderr: stderr,
  });
  pyoPackages.unshift("micropip");
  //installog(2, `Installing python packages ${packages.join(", ")}`);
  installLog(id, 2, `Creating python env`);
  await self.pyodide.loadPackage(pyoPackages);
  installLog(id, 3, `Installing python packages`);
  self.parray = packages;

  await pyodide.runPythonAsync(`
  import micropip
  from js import parray
  await micropip.install(parray.to_py())
  `);

  installLog(id, 4, `Initializing environment`);
  self.parray = undefined;
  const src = `from pyodide.code import eval_code_async
from pyodide.ffi import to_js
from js import console
import sys
async def pyeval(code, ns):
  names = []
  for name in sys.modules.keys():
  	if name.startswith("importable.") or name == "importable":
  		names.append(name)
  for name in names:
  	del sys.modules[name]
  if not "/" in sys.path:
  	sys.path.append("/")
  result = await eval_code_async(code, ns)
  ${transformCode}

  return to_js(result)`
  //console.log("SRC EXEC", src)
  await pyodide.runPythonAsync(src);
  if (initCode.length > 0) {
    await pyodide.runPythonAsync(initCode);
  }

  installLog(id, 5, "The python env is loaded")
  isPyLoaded = true;
}

async function runScript(python, id) {
  try {
    //console.log("Load imports")
    await self.pyodide.loadPackagesFromImports(python);
	let empty_dict = await self.pyodide.runPythonAsync("{}");
	console.log("abc!!!");
	//let results = await self.pyodide.globals.get("pyeval")(python, empty_dict)
	//empty_dict.destroy();

	manager.currentProcessId = ++manager.allocId; 
	console.log("Ich bin hier!!!"); 
	manager.tasks[manager.currentProcessId] = {
		"promise": self.pyodide.globals.get("pyeval")(python, empty_dict),
		"dict": empty_dict,
		"done": false,
	}

	let processId = manager.currentProcessId; 

	manager.tasks[processId]["promise"].then(() => {
		manager.tasks[processId]["done"] = true;
		manager.tasks[processId]["dict"].destroy();
		console.log("Task done!"); 
		run_end(id); 

	}).catch((error) => {
		manager.tasks[processId]["done"] = true;
		manager.tasks[processId]["dict"].destroy();
		console.log("PY RUN ERR", error)
		delete manager.tasks[processId]; 

		err(id, error.message)
	})

	console.log("End of file!"); 

  } catch (error) {
    console.log("PY RUN ERR", error)
    err(id, error.message)
  }
}
self.onmessageerror = e => {
	console.error(e);
  }
self.onmessage = async (event) => {
  const { id, python, ...context } = event.data;
  console.log("Recv message ", id, " python: ", python, " context:", context);
	if (id === "_pyinstaller") {
		await loadPyodideAndPackages(id, context.pyoPackages, context.packages, context.initCode, context.transformCode);
		run_end(id)
	}
	else if (id === "_write")
	{
		if (context === undefined)
			return;

		console.log("Starting ! name", context.name, " path:", context.path, " python: ", python)


		let _path = context.path.substring(1);
		let _dirs = _path.split("/");
		let value = {};

		let _tmp_path = "/";
		for (let i in _dirs) {
			let _dir = _dirs[i];
			_tmp_path += _dir + "/";
			value = self.pyodide.FS.analyzePath(_tmp_path);
			_tmp_path.replaceAll("//", "/");

			console.log("Temp Path:", _tmp_path)
			if (!value.exists) {
				self.pyodide.FS.mkdir(_tmp_path);

			}
		}

		console.log("I'm here! Write!", context.name, python, "FileSystem:", self.pyodide.FS)
		value = self.pyodide.FS.analyzePath(context.path);
		if (!value.exists) {
			self.pyodide.FS.mkdir(context.path);
			console.log("I'm here2! Creating Path:", context.path)
		}

		let file_path = context.path+context.name;
		file_path.replaceAll("//", "/");
		console.log(`Path for writing! ${file_path}`)

		value = self.pyodide.FS.analyzePath(file_path);
		if (value.exists) {
			self.pyodide.FS.unlink(file_path);
			//self.pyodide.FS.ftruncate(file_path, 0);
			console.log(`[SEARCHING] Path exists: ${file_path}`)
		}

		self.pyodide.FS.writeFile(file_path, python, {encoding: "utf-8"})
		console.log("I'm here3! Write!", context.name, python)
		console.log("I'm here4! Write!", context.name, python)
		end(id);

	}
	else if (id === "_removeFile")
	{
		let value = self.pyodide.FS.analyzePath(context.path);
		if (!value.exists) {
			end(id);
			return;
		}

		let file_path = context.path+context.name;
		file_path.replaceAll("//", "/");

		value = self.pyodide.FS.analyzePath(file_path);
		if (value.exists) {
			self.pyodide.FS.unlink(file_path);
		}

		end(id);

	}
	else if (id === "_removeDir")
	{
		let value = self.pyodide.FS.analyzePath(context.path);
		if (value.exists) {
			self.pyodide.FS.rmdir(context.path);
		}
		end(id);
	}
	else if (id === "_renameFile") {
		let value = self.pyodide.FS.analyzePath(context.srcPath);
		if (!value.exists) {
			end(id);
			return;
		}

		let srcPath = context.srcPath+context.srcName;
		srcPath.replaceAll("//", "/");


		value = self.pyodide.FS.analyzePath(context.dstPath);
		if (!value.exists) {
			self.pyodide.FS.mkdir(context.dstPath);
		}

		let dstPath = context.dstPath + context.dstName;
		dstPath.replaceAll("//", "/");

		self.pyodide.FS.rename(srcPath, dstPath);

		end(id);
	}
	else if (id === "_renameDir") {
		let value = self.pyodide.FS.analyzePath(context.srcPath);
		if (!value.exists) {
			end(id);
			return;
		}

		self.pyodide.FS.rename(context.srcPath, context.dstPath);

		end(id);
	}
	else if (id === "_setDirectoryHandle") {
		manager.resultValue = context.handle; 
	}
	else if (id === "_setFileHandle") {
		manager.resultValue = context.handle; 
	}	
	else if (id === "_setOpenFilePickerHandle") 
	{
		manager.resultValue = context.handle; 
	}
  else if (id === "_sendDialogSignal") {
	
	manager.resultValue = context.data; 
	console.log("_sendDialogSignal recv", manager.resultValue); 
	end(id); 

}
  else {

    // The worker copies the context in its own "memory" (an object mapping name to values)
    for (const key of Object.keys(context)) {
		//if (key === "showSaveFilePicker" || key === "showDirectoryPicker")
      	//	continue;
		self[key] = context[key];
    }
    if (!isPyLoaded) {
      //await loadPyodideAndPackages(id, []);
      throw new Error("Python is not loaded")
    }

		console.log("Functions:", context.showSaveFilePicker, " other", context.showDirectoryPicker)

		manager.resultValue = null; 

		await self.pyodide.registerJsModule("manager", manager);

		//end(id); 
		await runScript(python, id)
  }

};
