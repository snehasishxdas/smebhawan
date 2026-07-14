import mongoose from "mongoose";

// In-Memory fallback storage for sandbox development if Atlas is not reachable
export const memoryDb: {
  users: any[];
  rawMaterials: any[];
  clicks: any[];
  procurementRequests: any[];
  notifications: any[];
  auditLogs: any[];
} = {
  users: [],
  rawMaterials: [],
  clicks: [],
  procurementRequests: [],
  notifications: [],
  auditLogs: [],
};

// Seed default products into memory array to display beautifully immediately
const initialMaterials = [
  {
    _id: "m_1",
    title: "Indian Premium Mild Green Steel Bar",
    category: "Metals & Steel",
    supplier: "TATA Steel Supply Co.",
    location: "Mumbai, Maharashtra",
    description: "High-grade structural steel bars with superior yield strength, certified for commercial B2B construction.",
    priceQuote: 45000,
    unit: "Tons",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    isSold: false,
    rawLink: "steel_tata_99",
    approved: true,
  },
  {
    _id: "m_2",
    title: "Industrial Grade Polypropylene Granules",
    category: "Plastics & Polymer",
    supplier: "RIL Polymer Industries Ltd.",
    location: "Ahmedabad, Gujarat",
    description: "High fluidity polypropylene resin suitable for fine-grade injection molding and high-tensile plastics fabrication.",
    priceQuote: 92000,
    unit: "Tons",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80",
    isSold: false,
    rawLink: "poly_ril_01",
    approved: true,
  },
  {
    _id: "m_3",
    title: "High Purity Zinc Ore Concentrate",
    category: "Ore & Mineral",
    supplier: "Hindustan Zinc Minerals",
    location: "Udaipur, Rajasthan",
    description: "Concentrated zinc ore with a minimum of 55% zinc content, dry weight bases, processed with precision floatation.",
    priceQuote: 110000,
    unit: "Tons",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80",
    isSold: false,
    rawLink: "zinc_hz_75",
    approved: true,
  },
  {
    _id: "m_4",
    title: "Heavy Duty Rubber Elastomer Compounds",
    category: "Rubber & Elastomer",
    supplier: "MRF Elastomers Unit",
    location: "Kottayam, Kerala",
    description: "Compounded natural rubber optimized for high wear resistance, vibration damping, and B2B industrial gaskets.",
    priceQuote: 145000,
    unit: "Tons",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
    isSold: true, // Marked as premium sold item for demo
    rawLink: "rubber_mrf_32",
    approved: true,
  },
];

// Initialize memory mock arrays with safe seed data
memoryDb.rawMaterials.push(...initialMaterials);

// Build seed users (one admin, one customer/buyer, one supplier)
memoryDb.users.push(
  {
    _id: "u_admin",
    email: "smehouse25@gmail.com",
    password: "houseofsme@25",
    role: "admin",
    gstNumber: "27AAAAA1111A1Z1",
    companyName: "SmeBhawan HQ",
    premiumActive: true,
    creditLimit: 10000000,
    creditUsed: 0,
    approved: true,
  },
  {
    _id: "u_buyer",
    email: "buyer@gmail.com",
    password: "buyer",
    role: "buyer",
    gstNumber: "24BBBBB2222B2Z2",
    companyName: "SME Logistics and Fabrication",
    premiumActive: false,
    creditLimit: 5000000,
    creditUsed: 1250000,
    approved: true,
  },
  {
    _id: "u_supplier",
    email: "supplier@gmail.com",
    password: "supplier",
    role: "supplier",
    gstNumber: "22CCCCC3333C3Z3",
    companyName: "National Raw Materials Corp",
    premiumActive: true, // Supplier can have premium link tracker setup
    creditLimit: 0,
    creditUsed: 0,
    approved: true,
  }
);

// We define Mongoose Schemas if connection is active
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["buyer", "supplier", "admin"], default: "buyer" },
  gstNumber: { type: String },
  companyName: { type: String },
  contactName: { type: String },
  aboutCompany: { type: String },
  premiumActive: { type: Boolean, default: false },
  creditLimit: { type: Number, default: 5000000 },
  creditUsed: { type: Number, default: 0 },
  approved: { type: Boolean, default: true },
});

const RawMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  supplier: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  priceQuote: { type: Number, default: 0 },
  unit: { type: String, default: "Tons" },
  rating: { type: Number, default: 5 },
  image: { type: String },
  isSold: { type: Boolean, default: false },
  rawLink: { type: String, required: true, unique: true },
  approved: { type: Boolean, default: false },
  pendingEdits: { type: mongoose.Schema.Types.Mixed, default: null },
});

const ClickAnalyticsSchema = new mongoose.Schema({
  linkCode: { type: String, required: true },
  materialId: { type: String },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  deviceType: { type: String },
  geoCity: { type: String },
  isUnique: { type: Boolean, default: true },
});

const ProcurementRequestSchema = new mongoose.Schema({
  materialType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: "Tons" },
  deliveryLocation: { type: String },
  deliveryDate: { type: Date },
  budgetRange: { type: String },
  status: { type: String, default: "Pending" }, // Pending, Matched, QC_Verified, Approved, Shipped, Delivered
  msmeEmail: { type: String },
  msmeGst: { type: String },
  selectedSupplier: { type: String },
  qcReportUrl: { type: String },
  paymentPath: { type: String, default: "PathA_Direct" }, // PathA_Direct or PathB_Credit
  totalAmount: { type: Number, default: 0 },
  creditTenureDays: { type: Number, default: 30 },
  creditInterestDue: { type: Number, default: 0 },
  dueDate: { type: Date },
});

const NotificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  alertType: { type: String, enum: ["Action Required", "Status Update", "System Alert"], default: "System Alert" },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  payload: { type: mongoose.Schema.Types.Mixed, default: null },
  isRead: { type: Boolean, default: false },
});

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  role: { type: String, required: true },
});

export let UserModel: any = null;
export let RawMaterialModel: any = null;
export let ClickAnalyticsModel: any = null;
export let ProcurementRequestModel: any = null;
export let NotificationModel: any = null;
export let AuditLogModel: any = null;

let isMongoConnected = false;

export async function connectToDatabase() {
  if (isMongoConnected) return true;

  // Grab MongoDB connection details
  let mongoUri = process.env.MONGODB_URI || "mongodb+srv://smehouse25:YOUR_PASSWORD@cluster0.5oni7qb.mongodb.net/?appName=Cluster0";
  
  // Safe validation - if placeholder is unchanged, avoid standard connection attempt
  if (mongoUri.includes("YOUR_PASSWORD") || mongoUri.includes("<db_password>")) {
    console.warn("⚠️ MONGODB_URI is still using placeholder passwords. Running in Sandbox Memory Mode. You can configure MONGODB_URI in settings to persist directly to Atlas.");
    setupModelFallbacks();
    return false;
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoUri, {
      connectTimeoutMS: 8000,
      socketTimeoutMS: 30000,
    });
    
    isMongoConnected = true;
    console.log("🚀 Custom Mongo connection established successfully to Cluster0!");

    // Compile active models in mongoose context
    UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
    RawMaterialModel = mongoose.models.RawMaterial || mongoose.model("RawMaterial", RawMaterialSchema);
    ClickAnalyticsModel = mongoose.models.ClickAnalytics || mongoose.model("ClickAnalytics", ClickAnalyticsSchema);
    ProcurementRequestModel = mongoose.models.ProcurementRequest || mongoose.model("ProcurementRequest", ProcurementRequestSchema);
    NotificationModel = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
    AuditLogModel = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

    // Sync seed data to active MongoDB collection if empty (lazy loading)
    const materialsCount = await RawMaterialModel.countDocuments();
    if (materialsCount === 0) {
      await RawMaterialModel.insertMany(initialMaterials);
      console.log("🌱 Seeded raw materials list into MongoDB cluster.");
    }
    
    const usersCount = await UserModel.countDocuments();
    if (usersCount === 0) {
      await UserModel.insertMany(memoryDb.users);
      console.log("🌱 Seeded mock users database into MongoDB cluster.");
    }

    return true;
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB Atlas Cluster:", err);
    console.log("⚠️ Operating with robust memory storage fallback to enable full functional checkout flow!");
    setupModelFallbacks();
    return false;
  }
}

function setupModelFallbacks() {
  isMongoConnected = false;
  // Models stay null but active database functions below will check boolean flags and write to memoryDb cleanly.
}

export function isDbConnected() {
  return isMongoConnected;
}

// ==========================================
// DB ACCESSIBILITY METHODS FOR ROUTING
// ==========================================

export async function getUsers() {
  if (isMongoConnected && UserModel) {
    return await UserModel.find({});
  }
  return memoryDb.users;
}

export async function createUser(userData: any) {
  if (isMongoConnected && UserModel) {
    try {
      const newUser = new UserModel({
        ...userData,
        creditLimit: userData.creditLimit !== undefined ? userData.creditLimit : 5000000,
        creditUsed: userData.creditUsed !== undefined ? userData.creditUsed : 0,
      });
      return await newUser.save();
    } catch (e) {
      console.error("Mongoose registration save failed:", e);
    }
  }
  const newUserMemory = {
    _id: "u_" + Math.random().toString(36).substr(2, 9),
    ...userData,
    creditLimit: userData.creditLimit !== undefined ? userData.creditLimit : 5000000,
    creditUsed: userData.creditUsed !== undefined ? userData.creditUsed : 0,
  };
  memoryDb.users.push(newUserMemory);
  return newUserMemory;
}

export async function updateUser(userId: string, updateData: any) {
  if (isMongoConnected && UserModel) {
    return await UserModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
  }
  const user = memoryDb.users.find(u => u._id === userId || u.id === userId);
  if (user) {
    Object.assign(user, updateData);
    return user;
  }
  return null;
}

export async function deleteUser(userId: string) {
  if (isMongoConnected && UserModel) {
    return await UserModel.findByIdAndDelete(userId);
  }
  const index = memoryDb.users.findIndex(u => u._id === userId || u.id === userId);
  if (index !== -1) {
    return memoryDb.users.splice(index, 1)[0];
  }
  return null;
}

export async function getRawMaterials() {
  if (isMongoConnected && RawMaterialModel) {
    return await RawMaterialModel.find({});
  }
  return memoryDb.rawMaterials;
}

export async function createRawMaterial(materialData: any) {
  if (isMongoConnected && RawMaterialModel) {
    const freshVal = new RawMaterialModel(materialData);
    return await freshVal.save();
  }
  const newMaterial = {
    _id: "m_" + Math.random().toString(36).substr(2, 9),
    ...materialData,
    rating: Number(materialData.rating) || 5,
    priceQuote: Number(materialData.priceQuote) || 0,
    isSold: materialData.isSold || false,
  };
  memoryDb.rawMaterials.push(newMaterial);
  return newMaterial;
}

export async function updateRawMaterial(id: string, updateData: any) {
  if (isMongoConnected && RawMaterialModel) {
    return await RawMaterialModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }
  const item = memoryDb.rawMaterials.find(m => m._id === id || m.id === id);
  if (item) {
    Object.assign(item, updateData);
    return item;
  }
  return null;
}

export async function removeRawMaterial(id: string) {
  if (isMongoConnected && RawMaterialModel) {
    return await RawMaterialModel.findByIdAndDelete(id);
  }
  const index = memoryDb.rawMaterials.findIndex(m => m._id === id || m.id === id);
  if (index !== -1) {
    return memoryDb.rawMaterials.splice(index, 1)[0];
  }
  return null;
}

export async function getClicks() {
  if (isMongoConnected && ClickAnalyticsModel) {
    return await ClickAnalyticsModel.find({});
  }
  return memoryDb.clicks;
}

export async function registerClick(clickData: any) {
  if (isMongoConnected && ClickAnalyticsModel) {
    const rawClick = new ClickAnalyticsModel({
      ...clickData,
      timestamp: new Date(),
    });
    return await rawClick.save();
  }
  const freshClick = {
    _id: "c_" + Math.random().toString(36).substr(2, 9),
    ...clickData,
    timestamp: new Date(),
  };
  memoryDb.clicks.push(freshClick);
  return freshClick;
}

export async function getProcurementRequests() {
  if (isMongoConnected && ProcurementRequestModel) {
    return await ProcurementRequestModel.find({});
  }
  return memoryDb.procurementRequests;
}

export async function createProcurementRequest(reqData: any) {
  if (isMongoConnected && ProcurementRequestModel) {
    const freshObj = new ProcurementRequestModel({
      ...reqData,
      deliveryDate: reqData.deliveryDate ? new Date(reqData.deliveryDate) : new Date(Date.now() + 5*24*60*60*1000),
      dueDate: reqData.dueDate ? new Date(reqData.dueDate) : null,
    });
    return await freshObj.save();
  }
  const newReq = {
    _id: "r_" + Math.random().toString(36).substr(2, 9),
    ...reqData,
    status: reqData.status || "Pending",
    deliveryDate: reqData.deliveryDate ? new Date(reqData.deliveryDate) : new Date(Date.now() + 5*24*60*60*1000),
    dueDate: reqData.dueDate ? new Date(reqData.dueDate) : null,
  };
  memoryDb.procurementRequests.push(newReq);
  return newReq;
}

export async function updateProcurementRequest(id: string, updateData: any) {
  if (isMongoConnected && ProcurementRequestModel) {
    return await ProcurementRequestModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }
  const item = memoryDb.procurementRequests.find(r => r._id === id || r.id === id);
  if (item) {
    if (updateData.deliveryDate) updateData.deliveryDate = new Date(updateData.deliveryDate);
    if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);
    Object.assign(item, updateData);
    return item;
  }
  return null;
}

export async function getNotifications() {
  if (isMongoConnected && NotificationModel) {
    return await NotificationModel.find({}).sort({ timestamp: -1 });
  }
  return [...memoryDb.notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function createNotification(notifData: any) {
  if (isMongoConnected && NotificationModel) {
    const notif = new NotificationModel({
      ...notifData,
      timestamp: notifData.timestamp ? new Date(notifData.timestamp) : new Date(),
      isRead: notifData.isRead || false,
    });
    return await notif.save();
  }
  const newNotif = {
    _id: "n_" + Math.random().toString(36).substr(2, 9),
    id: "n_" + Math.random().toString(36).substr(2, 9),
    ...notifData,
    timestamp: notifData.timestamp || new Date().toISOString(),
    isRead: notifData.isRead || false,
  };
  memoryDb.notifications.push(newNotif);
  return newNotif;
}

export async function markNotificationAsRead(id: string) {
  if (isMongoConnected && NotificationModel) {
    if (id === "all") {
      await NotificationModel.updateMany({ isRead: false }, { $set: { isRead: true } });
      return true;
    }
    return await NotificationModel.findByIdAndUpdate(id, { $set: { isRead: true } }, { new: true });
  }
  if (id === "all") {
    memoryDb.notifications.forEach(n => n.isRead = true);
    return true;
  }
  const notif = memoryDb.notifications.find(n => n._id === id || n.id === id);
  if (notif) {
    notif.isRead = true;
    return notif;
  }
  return null;
}

export async function getAuditLogs() {
  if (isMongoConnected && AuditLogModel) {
    return await AuditLogModel.find({}).sort({ timestamp: -1 });
  }
  return [...memoryDb.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function createAuditLog(logData: any) {
  if (isMongoConnected && AuditLogModel) {
    const log = new AuditLogModel({
      ...logData,
      timestamp: logData.timestamp ? new Date(logData.timestamp) : new Date(),
    });
    return await log.save();
  }
  const newLog = {
    _id: "a_" + Math.random().toString(36).substr(2, 9),
    ...logData,
    timestamp: logData.timestamp || new Date().toISOString(),
  };
  memoryDb.auditLogs.push(newLog);
  return newLog;
}
