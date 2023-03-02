import worker from 'web-worker:./webworker.js';
import { pyLog, progressBar, pyLogging, pyDialogs, pyExecState, pyInstallLog, isPyExecuting, isPyReadyState, isPyReady } from "./store";

/** The main composable */
const usePython = () => {
  let _pyodideWorker = new worker(); 
  //let interruptBuffer = new Uint8Array(new SharedArrayBuffer(1));

  let _callback: (value: {
    results: any;
    error: any;
  } | PromiseLike<{
    results: any;
    error: any;
  }>) => void = (v) => null;

  let _callback_map = new Map();
  

  async function _dispatchEvent(id: string, data: Record<string, any>) {
    console.log("Python process id recv", id, " data ", data); 
    switch (data.type) {
      case "end":  
      {
        _callback({ results: data.res, error: null })
        _callback = (v) => null
        break;
      }
      // PYTHO NSCRIPT
      case "run_end":  {

        let _cb = _callback_map.get(id); 

        if (_cb) {
          _cb({ results: data.res, error: null })
          pyExecState.set(0);
          _callback_map.delete(id); 
        }

        break;
      }
      
      case "err": {
        _callback = (v) => null
        pyExecState.set(0);
        pyLog.setKey("exception", data.msg)
        break;
      }

      case "installlog":
        pyInstallLog.setKey("stage", data.msg.stage);
        pyInstallLog.setKey("msg", data.msg.msg);
        break;
      case "stderr":
        //console.log("STDERR:", data.msg)
        pyLog.get().stdErr.push(data.msg);
        pyLog.notify();
        break;
      case "stdout":
        //console.log("STDOUT:", data.msg)
		  pyLog.get().stdOut = [];
        pyLog.get().stdOut.push(data.msg);
        pyLog.notify();
        //pyLog.setKey("stdOut", [...pyLog.get().stdOut, data.msg])
        break;

      case "progressbar":
        progressBar.set({
          total: data.total,
          step: data.step, 
          maxStep: data.max_step, 
          txt: data.txt
        });
        break;

	   case "download":
		   var url = window.URL.createObjectURL(data["blob"]);
		   var downloadLink = document.createElement("a");
		   downloadLink.href = url;
		   downloadLink.download = data["filename"];
		   document.body.appendChild(downloadLink);
		   downloadLink.click();
		   document.body.removeChild(downloadLink);
		break;
		case "log":
			pyLogging.get().push({
				text: data.text,
				level: data.level,
        done: false
			})
			pyLogging.notify();


			break;

    case "alert":
			pyDialogs.get().push({
				type: "alert",
				text: data.text,
        done: false
			})
			pyDialogs.notify();
      break;

    case "confirm":
			pyDialogs.get().push({
				type: "confirm",
				title: data.title, 
        text: data.text,
        cancel: data.cancel,
        done: false
			})
			pyDialogs.notify();
      break;

    case "input":
			pyDialogs.get().push({
				type: "input",
        done: false,
        ...data
			})
			pyDialogs.notify();
      break;

  
      case "select":
        pyDialogs.get().push({
          type: "select",
          done: false,
          ...data
        })
        pyDialogs.notify();
        break;


        case "showDirectoryPicker":
          {
            let handle = -1;
            try {
              handle = await window.showDirectoryPicker({
                mode: "readwrite"
            })
            }
            catch (e) {
            }

            _pyodideWorker.postMessage({
                id: "_setDirectoryHandle",
                handle
            });


            break;
          }

        case "showSaveFilePicker":
            let handle = -1; 
            try {
              handle = await window.showSaveFilePicker()
            }
            catch (e) {
            }

            _pyodideWorker.postMessage({
                id: "_setFileHandle",
                handle: handle
            });


            break;        
            
          case "showOpenFilePicker": {
            let handle = -1; 
            try {
              handle = await window.showOpenFilePicker({
                multiple: false
              })
            }
            catch (e) {
            }

            _pyodideWorker.postMessage({
                id: "_setOpenFilePickerHandle",
                handle
            });


            break;
          }
      default:
        pyExecState.set(0);
        throw new Error(`Unknown event type ${data.type}`)
    }
  }

  function _processTransformCode(code: string): string {
    if (code.startsWith('\n')) {
      code.replace('\n', '')
    }
    const li = code.split("\n");
    const buf = new Array<string>();
    li.forEach((el) => {
      buf.push('  ' + el)
    });
    return buf.join("\n")
  }
  
  /** Load the Python runtime */
  async function load(pyoPackages: Array<string> = [], packages: Array<string> = [], initCode = "", transformCode = ""): Promise<{ results: any, error: any }> {
    let res: { results: any; error: any };
    try {

      res = await run("", "_pyinstaller", {
        pyoPackages: pyoPackages,
        packages: packages,
        initCode: initCode,
        transformCode: _processTransformCode(transformCode)
      });



    } catch (e) {
      throw new Error(
        // @ts-ignore
        `Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`
      );
    }
    isPyReadyState.set(1);
    return res
  }

  /** Run a Python script
   * @param id the script id
   * @param script the Python code to run
   * @param context some context data to pass to the runtime
   */
  async function run(script: string, id?: string, context: Record<string, any> = {}): Promise<{ results: any, error: any }> {
    if (pyExecState.get() === 1) {
      throw new Error("Only one python script can run at the time")
    }
    pyExecState.set(1);
    // reset logger
    const _id = id ?? (+ new Date()).toString();
    pyLog.set({
      id: _id,
      stdOut: [],
      stdErr: [],
      exception: "",
		logging: [],
    });
    // exec
    return new Promise((onSuccess) => {
      //_callback = onSuccess;
      _callback_map.set(_id, onSuccess); 

      _pyodideWorker.postMessage({
        id: _id,
        python: script,
        ...context,
      });
    });
  }

  let restore = false; 

  let restoreWriteList: Record<string, string>[] = []; 

  async function write(path: string, name: string, python: string): Promise<{ results: any, error: any }> {
	  let context = {
		  name: name,
		  path: path,

	  }
    
    if (!restore)
      restoreWriteList.push({path, name, python})

    return new Promise((onSuccess) => {
      //_callback_map.set("_write", onSuccess); 
      _callback = onSuccess; 
      _pyodideWorker.postMessage({
        id: "_write",
        python: python,
        ...context,
      });
    });
  }

  let removeFileList: Record<string, string>[] = []; 


  async function removeFile(path: string, name: string): Promise<{ results: any, error: any }> {
	  let context = {
		  name: name,
		  path: path,

	  }

    if (!restore)
      removeFileList.push({path, name})

    return new Promise((onSuccess) => {
      _callback = onSuccess;
      _pyodideWorker.postMessage({
        id: "_removeFile",
        ...context,
      });
    });
  }

  let removeDirList: Record<string, string>[] = []; 

  async function removeDir(path: string,): Promise<{ results: any, error: any }> {
	  let context = {
		  path: path,

	  }

    if (!restore)
      removeDirList.push({path})

    return new Promise((onSuccess) => {
      _callback = onSuccess;
      _pyodideWorker.postMessage({
        id: "_removeDir",
        ...context,
      });
    });
  }

  let renameFileList: Record<string, string>[] = []; 

	async function renameFile(srcPath: string, srcName: string, dstPath: string, dstName: string): Promise<{ results: any, error: any }> {
		let context = {
			srcPath: srcPath,
			srcName: srcName,
			dstPath: dstPath,
			dstName: dstName,

		}

    if (!restore)
    renameFileList.push({
      srcPath,
      srcName,
      dstPath,
      dstName
    })

		return new Promise((onSuccess) => {
			_callback = onSuccess;
			_pyodideWorker.postMessage({
				id: "_renameFile",
				...context,
			});
		});
	}

  let renameDirList: Record<string, string>[] = []; 

	async function renameDir(srcPath: string, dstPath: string,): Promise<{ results: any, error: any }> {
		let context = {
			srcPath: srcPath,
			dstPath: dstPath,
		}


		return new Promise((onSuccess) => {
			_callback = onSuccess;
			_pyodideWorker.postMessage({
				id: "_renameDir",
				...context,
			});
		});
	}

  
  function interruptExecution() {
    // 2 stands for SIGINT.
    _pyodideWorker.postMessage({
      id: "interrupt"
    })
  }

  function bindEventWorker() {
    _pyodideWorker.onmessage = async (event) => {
      const { id, ...data } = event.data;
      //console.log("=> msg in:", id, ":", data);
      await _dispatchEvent(id ?? "", data)
    };

    _pyodideWorker.onmessageerror = async (error) => {
      console.log(error); 
    }
  }

  bindEventWorker();

  function destroyAndCreateWorker() {
    if (_pyodideWorker) {
      _pyodideWorker.terminate();
    }

    isPyReadyState.set(0);
    pyExecState.set(0);

//    let _pyodideWorker2 = new worker(); 

    _pyodideWorker = new worker(); 
    bindEventWorker();
    
    //_pyodideWorker.postMessage({id: "setFS",
    //fs: pyodide_fs})

  }

  async function restoreFS() {

    restore = true;

    for (let index in restoreWriteList) {
      let entry = restoreWriteList[index]; 
      await write(entry.path, entry.name, entry.python);
    }

    //restoreWriteList = [];


    for (let index in renameDirList) {
      let entry = renameDirList[index]; 
      await renameDir(entry.srcPath, entry.dstPath);
    }

    //renameDirList = [];

    for (let index in renameFileList) {
      let entry = renameDirList[index]; 
      await renameFile(entry.srcPath, entry.srcName, entry.dstPath, entry.dstName);
    }

    //renameFileList = [];


    for (let index in removeDirList) {
      let entry = removeDirList[index]; 
      await removeDir(entry.path);
    }

    //removeDirList = [];

    for (let index in removeFileList) {
      let entry = removeFileList[index]; 
      await removeFile(entry.path, entry.name);
    }

    //removeFileList = [];

    restore = false;
  }

  async function sendDialogResult(type: string, data: any) {
		let context = {
			type: type,
			data: structuredClone(data),
		}

    return new Promise((onSuccess) => {
			//_callback = onSuccess;
      console.log("IM HERE!"); 
			_pyodideWorker.postMessage({
				id: "_sendDialogSignal",
				...context,
			});
		});
	}
  



  return {
    load,
    run,
    /** The install log store */
    installLog: pyInstallLog,
    /** The runtime log store */
    log: pyLog,
    /** The execution state atom */
    isExecuting: isPyExecuting,
    /** The ready state atom */
    isReady: isPyReady,
	  pyLogging: pyLogging,
    pyDialogs: pyDialogs,
    progressBar,
	  write,
	  removeFile,
	  removeDir,
	  renameFile,
	  renameDir,
    interruptExecution,
    destroyAndCreateWorker,
    restoreFS,
    sendDialogResult

  }
}

export { usePython }
