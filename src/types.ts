export interface User {
  _id: string;
  email: string;
  role: 'buyer' | 'supplier' | 'admin';
  gstNumber?: string;
  companyName?: string;
  contactName?: string;
  aboutCompany?: string;
  premiumActive: boolean;
  creditLimit: number; // approved limit for Path B Credit
  creditUsed: number;
  approved?: boolean;
}

export interface RawMaterial {
  _id: string;
  title: string;
  category: string;
  supplier: string;
  location: string;
  description: string;
  priceQuote: number;
  unit: string;
  rating: number;
  image: string;
  isSold: boolean;
  rawLink: string; // The URL tracking shortcode for click analytics
  approved?: boolean;
  pendingEdits?: {
    title: string;
    category: string;
    location: string;
    description: string;
    priceQuote: number;
    unit: string;
    image?: string;
  } | null;
}

export interface LinkClick {
  _id: string;
  linkCode: string;
  materialId?: string;
  timestamp: string;
  ipAddress: string;
  deviceType: string;
  geoCity: string;
  isUnique: boolean;
}

export interface ProcurementRequest {
  _id: string;
  materialType: string;
  quantity: number;
  unit: string;
  deliveryLocation: string;
  deliveryDate: string;
  budgetRange: string;
  status: 'Pending' | 'Matched' | 'QC_Verified' | 'Approved' | 'Awaiting_Dispatch_Approval' | 'Shipped' | 'Delivered' | 'Delivered_Repaid';
  msmeEmail: string;
  msmeGst: string;
  selectedSupplier?: string;
  qcReportUrl?: string;
  paymentPath: 'PathA_Direct' | 'PathB_Credit';
  totalAmount: number;
  creditTenureDays: number;
  creditInterestDue: number;
  dueDate?: string;
}

export interface AppNotification {
  id: string;
  _id?: string;
  type: string;
  alertType?: "Action Required" | "Status Update" | "System Alert";
  message: string;
  timestamp: string;
  isRead?: boolean;
  payload?: any;
}

export interface AuditLog {
  _id?: string;
  action: string;
  details: string;
  timestamp: string;
  userId: string;
  role?: string;
}
