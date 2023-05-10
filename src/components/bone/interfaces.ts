import type {BoneValue} from "./bones/rawBone";

export interface BoneError {
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
  emptyvalue: BoneValue;
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
  minAmount: number;
  maxAmount: number;

  //text
  valid_html: valid_html;

  //file
  valid_mime_types: string[];

  //spatial
  boundslng: [number, number];
  boundslat: [number, number];


}

interface valid_html {
  validTags: string[];
  validAttrs: Record<string, string[]>;
  validStyles: string[];
  validClasses: string[];
  singleTags: string[];

}

export interface SkelValues {
  key: string;
  creationdate: string;
  changedate: string;
  viurCurrentSeoKeys: string;

}

export interface FileSkelValues extends SkelValues {
  name: string;
  downloadUrl: string;
  size: string;
  dlkey: string;
  mimetype: string;
  weak: boolean;
  pending: boolean;
  width: number;
  height: number;

}

export interface UploadUrlResponse {
  uploadKey: string;
  uploadUrl: string;
}

export interface ListResponse {
  action: string;
}
