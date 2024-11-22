export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface Response {
  status: number;
  description: string;
  schema?: string;
}

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: Parameter[];
  responses?: Response[];
  notes?: string;
} 