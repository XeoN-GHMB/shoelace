export interface boneError {
  severity: number;
  fieldPath: string[];
  errorMessage: string;
  invalidFields: string[];
}
export interface BoneStructure {
  descr: string;
  type: string;
  required: boolean;
  params: Record<string, any>;
  visible: boolean;
  readonly: boolean;
  unique: boolean;
  languages: string[];
  emptyValue: any;
  multiple: boolean;
  //Optional Fields

  //relational
  module: string;
  format: string;
  using: [];
  relskel: object;

  //select
  values: [];

  //date
  date: boolean;
  time: boolean;

  //numeric
  precision: number;
  min: number;
  max: number;

  //text
  validHtml: ValidHtml;

  //file
  validMimeTypes: string[];

  //spatial
  boundsLng: [number, number];
  boundsLat: [number, number]


}

interface ValidHtml {
  validTags: string[];
  validAttrs: Record<string, Array<string>>;
  validStyles: string[];
  validClasses: string[];
  singleTags: string[];

}
export interface SkelValues{
  key:string;
  creationdate:string;
  changedate:string;
  viurCurrentSeoKeys:string;

}
export interface FileSkelValues extends  SkelValues{
  name:string;
  downloadUrl:string;
  size:string;
  dlkey:string;
  mimetype:string;
  weak:boolean;
  pending:boolean;
  width:number;
  height:number;

}
