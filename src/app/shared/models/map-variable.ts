export interface MapVariable {
  variableId: number;
  name: string;
  featureServiceUrl?: string;
  fieldName: string;
  bivariateField: string;
  moransField:string;
  valueType: string;
  yearsAvailable: number[];
  disabled: boolean;  
}
