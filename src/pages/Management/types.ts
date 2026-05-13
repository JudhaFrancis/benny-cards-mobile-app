export interface ManagementOrder {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
  resolved_status: string;
  total_amount: any;
  order_date: string;
  delivery_date?: string;
  client_information?: any;
  designing?: any;
  printing?: any;
  packaging?: any;
  dispatch_delivery?: any;
  customer_details?: any;
  total_quantity?: number | string;
}

export type ManagementStage = 'client-information' | 'designing' | 'printing' | 'packaging' | 'delivery';
