interface PyLog {
  id: string;
  stdOut: Array<string>;
  stdErr: Array<string>;
  logging: Array<Object>;
  exception: string;
}

interface PyInstallLog {
  stage: number;
  msg: string;
}

interface ProgressbarDetails {
  // total=total, step=step, max_step=max_step, txt=txt
  total: number; 
  step: number; 
  maxStep: number;
  txt: String
}

export { PyLog, PyInstallLog, ProgressbarDetails }
