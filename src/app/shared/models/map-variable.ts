export interface MapVariable {
  variableId: number;
  name: string;
  featureServiceUrl?: string;
  fieldName: string;
  valueType: string;
  yearsAvailable: number[];
  disabled: boolean;  
}
