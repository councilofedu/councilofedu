import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import net from "net";
import { spawn } from "child_process";

// Load environment variables from .env file
dotenv.config();

// Global safety catchers to prevent asynchronous socket/network errors from crashing the Express container process
process.on("unhandledRejection", (reason, promise) => {
  console.error("CRITICAL: Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("CRITICAL: Uncaught Exception thrown:", err);
});

// Configure Cloudinary with user credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "ntjeitgo",
  api_key: process.env.CLOUDINARY_API_KEY || "124768824851751",
  api_secret: process.env.CLOUDINARY_API_SECRET || "kvpfR4hkJ58gmW76dbbvU-cX7EQ",
  secure: true
});
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, connectAuthEmulator } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection as realCollection,
  doc as realDoc,
  getDocs as realGetDocs,
  getDoc as realGetDoc,
  setDoc as realSetDoc,
  updateDoc as realUpdateDoc,
  deleteDoc as realDeleteDoc,
  query as realQuery,
  where as realWhere,
  orderBy as realOrderBy,
  getDocFromServer as realGetDocFromServer
} from "firebase/firestore";

let useLocalMockDb = false;
const LOCAL_DB_DIR = path.join(process.cwd(), "local_db");

function getLocalCollection(collectionName: string): Record<string, any> {
  if (!fs.existsSync(LOCAL_DB_DIR)) {
    fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
  }
  const filePath = path.join(LOCAL_DB_DIR, `${collectionName}.json`);
  if (!fs.existsSync(filePath)) {
    const seedData = (INITIAL_DATA as any)[collectionName];
    if (seedData && Array.isArray(seedData)) {
      const initialMap: Record<string, any> = {};
      for (const item of seedData) {
        initialMap[item.id] = item;
      }
      fs.writeFileSync(filePath, JSON.stringify(initialMap, null, 2), "utf-8");
      return initialMap;
    }
    if (collectionName === "siteSettings") {
      const initialMap = { current: INITIAL_DATA.siteSettings };
      fs.writeFileSync(filePath, JSON.stringify(initialMap, null, 2), "utf-8");
      return initialMap;
    }
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return {};
  }
}

function saveLocalCollection(collectionName: string, data: Record<string, any>) {
  if (!fs.existsSync(LOCAL_DB_DIR)) {
    fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
  }
  const filePath = path.join(LOCAL_DB_DIR, `${collectionName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function doc(parent: any, ...pathSegments: string[]): any {
  if (useLocalMockDb) {
    let collectionName = "";
    let docId = "";
    if (parent && parent.type === "collection") {
      collectionName = parent.name;
      docId = pathSegments[0];
    } else {
      collectionName = pathSegments[0];
      docId = pathSegments[1];
    }
    return {
      type: "doc",
      collection: collectionName,
      id: docId
    };
  }
  return realDoc(parent, ...pathSegments);
}

function collection(parent: any, collectionName: string): any {
  if (useLocalMockDb) {
    return {
      type: "collection",
      name: collectionName
    };
  }
  return realCollection(parent, collectionName);
}

function query(collectionRef: any, ...constraints: any[]): any {
  if (useLocalMockDb) {
    return {
      type: "query",
      collection: collectionRef.name,
      constraints
    };
  }
  return realQuery(collectionRef, ...constraints);
}

function where(fieldPath: string, opStr: any, value: any): any {
  if (useLocalMockDb) {
    return { type: "where", fieldPath, opStr, value };
  }
  return realWhere(fieldPath, opStr, value);
}

function orderBy(fieldPath: string, directionStr?: any): any {
  if (useLocalMockDb) {
    return { type: "orderBy", fieldPath, directionStr };
  }
  return realOrderBy(fieldPath, directionStr);
}

async function getDoc(docRef: any): Promise<any> {
  if (useLocalMockDb) {
    const dataMap = getLocalCollection(docRef.collection);
    const docData = dataMap[docRef.id];
    return {
      id: docRef.id,
      exists: () => docData !== undefined,
      data: () => docData
    };
  }
  return realGetDoc(docRef);
}

async function getDocFromServer(docRef: any): Promise<any> {
  if (useLocalMockDb) {
    return getDoc(docRef);
  }
  return realGetDocFromServer(docRef);
}

async function setDoc(docRef: any, data: any, options?: any): Promise<any> {
  if (useLocalMockDb) {
    const dataMap = getLocalCollection(docRef.collection);
    if (options && options.merge) {
      dataMap[docRef.id] = { ...dataMap[docRef.id], ...data };
    } else {
      dataMap[docRef.id] = data;
    }
    saveLocalCollection(docRef.collection, dataMap);
    return;
  }
  return realSetDoc(docRef, data, options);
}

async function updateDoc(docRef: any, data: any): Promise<any> {
  if (useLocalMockDb) {
    const dataMap = getLocalCollection(docRef.collection);
    if (dataMap[docRef.id]) {
      dataMap[docRef.id] = { ...dataMap[docRef.id], ...data };
      saveLocalCollection(docRef.collection, dataMap);
    }
    return;
  }
  return realUpdateDoc(docRef, data);
}

async function deleteDoc(docRef: any): Promise<any> {
  if (useLocalMockDb) {
    const dataMap = getLocalCollection(docRef.collection);
    delete dataMap[docRef.id];
    saveLocalCollection(docRef.collection, dataMap);
    return;
  }
  return realDeleteDoc(docRef);
}

async function getDocs(queryOrCollectionRef: any): Promise<any> {
  if (useLocalMockDb) {
    const collectionName = queryOrCollectionRef.type === "query" 
      ? queryOrCollectionRef.collection 
      : queryOrCollectionRef.name;
    
    const dataMap = getLocalCollection(collectionName);
    let items = Object.values(dataMap);
    
    if (queryOrCollectionRef.type === "query") {
      const constraints = queryOrCollectionRef.constraints || [];
      for (const c of constraints) {
        if (c && c.type === "where") {
          const { fieldPath, opStr, value } = c;
          items = items.filter(item => {
            const fieldVal = item[fieldPath];
            if (opStr === "==") return fieldVal === value;
            if (opStr === "!=") return fieldVal !== value;
            if (opStr === ">") return fieldVal > value;
            if (opStr === ">=") return fieldVal >= value;
            if (opStr === "<") return fieldVal < value;
            if (opStr === "<=") return fieldVal <= value;
            if (opStr === "array-contains") return Array.isArray(fieldVal) && fieldVal.includes(value);
            return true;
          });
        }
      }
      
      for (const c of constraints) {
        if (c && c.type === "orderBy") {
          const { fieldPath, directionStr } = c;
          const isDesc = directionStr === "desc";
          items.sort((a, b) => {
            const valA = a[fieldPath];
            const valB = b[fieldPath];
            if (valA < valB) return isDesc ? 1 : -1;
            if (valA > valB) return isDesc ? -1 : 1;
            return 0;
          });
        }
      }
    }
    
    const docs = items.map(item => ({
      id: item.id || "",
      exists: () => true,
      data: () => item
    }));
    
    return {
      empty: docs.length === 0,
      docs,
      forEach: (callback: any) => docs.forEach(callback),
      length: docs.length
    };
  }
  return realGetDocs(queryOrCollectionRef);
}


const app = express();
const PORT = Number(process.env.PORT || 3000);

// Set up middle-wares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Load Firebase applet configuration
const CONFIG_FILE = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseConfig: any = null;
if (fs.existsSync(CONFIG_FILE)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  } catch (error) {
    console.error("Error reading firebase-applet-config.json:", error);
  }
} else {
  console.error("firebase-applet-config.json not found!");
}

let firebaseDb: any = null;
if (firebaseConfig) {
  try {
    const appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)" && firebaseConfig.firestoreDatabaseId !== "") {
      firebaseDb = getFirestore(appInstance, firebaseConfig.firestoreDatabaseId);
    } else {
      firebaseDb = getFirestore(appInstance);
    }
    console.log("Firebase initialized successfully with DB ID:", firebaseConfig.firestoreDatabaseId || "(default)");

    // Connect to Firestore Emulator if configured
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      const [host, portStr] = process.env.FIRESTORE_EMULATOR_HOST.split(":");
      connectFirestoreEmulator(firebaseDb, host, parseInt(portStr || "8080", 10));
      console.log("Firestore Emulator connected at:", process.env.FIRESTORE_EMULATOR_HOST);
    }

    // Connect to Auth Emulator if configured
    const authInstance = getAuth(appInstance);
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      connectAuthEmulator(authInstance, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
      console.log("Firebase Auth Emulator connected at:", process.env.FIREBASE_AUTH_EMULATOR_HOST);
    }
  } catch (error) {
    console.error("Failed to initialize Firebase app or Firestore:", error);
  }
}

// Define initial seed data
const INITIAL_DATA = {
  memberships: [],
  teamMembers: [],
  inquiries: [],
  siteSettings: {
    homeTitle: "Empowering Mathematics Educators Across Nepal",
    homeSubtitle: "Celebrating 35 years of professional leadership, pedagogical research, and modern training curriculum designed for teachers across Nepal.",
    homeNoticeBanner: "Membership open for academic year 2026/2027. Apply online to get your CME Digital Card instantly verified.",
    aboutHomeTitle: "A Legacy of Excellence in Mathematics Education",
    aboutHomeText: "Established in 1991 (2048 B.S.), the Council for Mathematics Education (CME) is Nepal's pioneer government-recognized academic society. We connect primary teachers, secondary educators, university scholars, and researchers under one unified national framework to modernize the teaching and learning of mathematics.",
    ctaButtonText: "Apply for Online Membership",
    supportEmail: "info@mathscouncil.edu.np",
    supportPhone: "+977-1-5524320 / +977-1-5544212",
    contactAddress: "Manbhawan, Ward 5, Lalitpur (Near Lalitpur High School), Lalitpur District, Nepal",
    contactPhone: "+977-1-5524320 / +977-1-5544212",
    contactEmails: "info@mathscouncil.edu.np, secretary@mathscouncil.edu.np",
    contactOfficeHours: "Sunday to Friday (Academic Session):\n10:00 AM – 4:00 PM (NPT)\nClosed on National Gazetted Holidays and Saturdays.",
    contactMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.670067064108!2d85.32045889999999!3d27.665677799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19d13d9ed2c3%3A0xbd62ef28c7ba5593!2sLalitpur%20Madhyamik%20Vidyalaya%20(LMV)!5e0!3m2!1sen!2snp!4v1782899459479!5m2!1sen!2snp"
  },
  blogs: [],
  testimonials: [],
  faqs: [],
  users: []
};


// Security definitions for Error Handling
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on startup
async function testConnection() {
  if (!firebaseDb) return;
  try {
    await getDocFromServer(doc(firebaseDb, 'test', 'connection'));
    console.log("Firebase Firestore connection verified successfully.");
  } catch (error) {
    console.log("Firestore connection test completed.");
  }
}

// Seed database if it's empty
async function seedDatabase() {
  if (!firebaseDb) return;
  console.log("Checking Firestore database for seed data...");
  try {
    // 1. Memberships
    const memSnap = await getDocs(collection(firebaseDb, "memberships"));
    if (memSnap.empty) {
      console.log("Seeding memberships...");
      for (const item of INITIAL_DATA.memberships) {
        await setDoc(doc(firebaseDb, "memberships", item.id), item);
      }
    }

    // 2. Team Members
    const teamSnap = await getDocs(collection(firebaseDb, "teamMembers"));
    if (teamSnap.empty) {
      console.log("Seeding teamMembers...");
      for (const item of INITIAL_DATA.teamMembers) {
        await setDoc(doc(firebaseDb, "teamMembers", item.id), item);
      }
    }

    // 3. Inquiries
    const inqSnap = await getDocs(collection(firebaseDb, "inquiries"));
    if (inqSnap.empty) {
      console.log("Seeding inquiries...");
      for (const item of INITIAL_DATA.inquiries) {
        await setDoc(doc(firebaseDb, "inquiries", item.id), item);
      }
    }

    // 4. Site Settings
    const settingsSnap = await getDoc(doc(firebaseDb, "siteSettings", "current"));
    if (!settingsSnap.exists()) {
      console.log("Seeding siteSettings...");
      await setDoc(doc(firebaseDb, "siteSettings", "current"), INITIAL_DATA.siteSettings);
    }

    // 5. Blogs
    const blogsSnap = await getDocs(collection(firebaseDb, "blogs"));
    if (blogsSnap.empty) {
      console.log("Seeding blogs...");
      for (const item of INITIAL_DATA.blogs) {
        await setDoc(doc(firebaseDb, "blogs", item.id), item);
      }
    }

    // 6. Testimonials
    const testSnap = await getDocs(collection(firebaseDb, "testimonials"));
    if (testSnap.empty) {
      console.log("Seeding testimonials...");
      for (const item of INITIAL_DATA.testimonials) {
        await setDoc(doc(firebaseDb, "testimonials", item.id), item);
      }
    }

    // 7. FAQs
    const faqsSnap = await getDocs(collection(firebaseDb, "faqs"));
    if (faqsSnap.empty) {
      console.log("Seeding faqs...");
      for (const item of INITIAL_DATA.faqs) {
        await setDoc(doc(firebaseDb, "faqs", item.id), item);
      }
    }

    // 8. Users
    const usersSnap = await getDocs(collection(firebaseDb, "users"));
    if (usersSnap.empty) {
      console.log("Seeding users...");
      for (const item of INITIAL_DATA.users) {
        await setDoc(doc(firebaseDb, "users", item.id), item);
      }
    }

    console.log("Database seed check complete.");
  } catch (error) {
    console.error("Error during seeding database:", error);
  }
}

// Authenticate the server-side client SDK instance as an admin to satisfy firestore.rules
async function authenticateServer(appInstance: any): Promise<boolean> {
  const authInstance = getAuth(appInstance);
  const adminEmail = "council.edu.developer@gmail.com";
  const adminPassword = process.env.SERVER_ADMIN_PASSWORD || "CouncilDevAdmin2026!";

  console.log("Authenticating server-side Firebase client...");
  try {
    await signInWithEmailAndPassword(authInstance, adminEmail, adminPassword);
    console.log("Server successfully authenticated as admin:", adminEmail);
    return true;
  } catch (authError: any) {
    if (
      authError.code === "auth/user-not-found" ||
      authError.code === "auth/invalid-credential" ||
      authError.code === "auth/invalid-email" ||
      authError.code === "auth/missing-password" ||
      authError.message.includes("credential")
    ) {
      console.log("Admin user account not found. Attempting to auto-register...");
      try {
        await createUserWithEmailAndPassword(authInstance, adminEmail, adminPassword);
        console.log("Admin account successfully registered and server authenticated:", adminEmail);
        return true;
      } catch (regError: any) {
        console.error("Critical: Failed to auto-register admin account on Firebase Auth:", regError);
        return false;
      }
    } else {
      console.error("Critical: Failed to authenticate server as admin:", authError);
      return false;
    }
  }
}

function isPortOpen(port: number, host: string = "127.0.0.1"): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const onError = () => {
      socket.destroy();
      resolve(false);
    };
    socket.setTimeout(1000);
    socket.once("error", onError);
    socket.once("timeout", onError);
    socket.connect(port, host, () => {
      socket.end();
      resolve(true);
    });
  });
}

async function ensureEmulatorsRunning() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return;
  }
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    return;
  }

  const host = "127.0.0.1";
  let firestorePort = 8080;
  let authPort = 9099;

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    const parts = process.env.FIRESTORE_EMULATOR_HOST.split(":");
    if (parts.length === 2) {
      firestorePort = parseInt(parts[1], 10);
    }
  }

  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    const parts = process.env.FIREBASE_AUTH_EMULATOR_HOST.split(":");
    if (parts.length === 2) {
      authPort = parseInt(parts[1], 10);
    }
  }

  const isFirestoreOpen = await isPortOpen(firestorePort, host);
  const isAuthOpen = await isPortOpen(authPort, host);

  if (isFirestoreOpen && isAuthOpen) {
    console.log("Firebase Emulators are already running.");
    return;
  }

  console.log("Firebase Emulators are not running. Starting emulators...");

  const emulatorProcess = spawn(
    "npx",
    ["firebase", "emulators:start", "--import=./.firebase_emulator_data", "--export-on-exit"],
    { shell: true, stdio: "inherit" }
  );

  emulatorProcess.on("error", (err) => {
    console.error("Error starting Firebase Emulators process:", err);
  });

  // Wait for the emulator ports to become active (up to 15 seconds)
  console.log("Waiting for emulators to start up...");
  for (let i = 0; i < 5; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const firestoreReady = await isPortOpen(firestorePort, host);
    const authReady = await isPortOpen(authPort, host);
    if (firestoreReady && authReady) {
      console.log("Firebase Emulators are now ready and listening.");
      return;
    }
  }
  console.warn("Warning: Emulators did not start. Switching to local JSON database fallback.");
  useLocalMockDb = true;
}

// Perform Startup actions
if (firebaseDb) {
  const appInstance = getApps()[0];
  ensureEmulatorsRunning().then(() => {
    if (useLocalMockDb) {
      console.log("Local Mock Database fallback active. Seeding mock collections...");
      // Seed local collections if directories are empty
      getLocalCollection("memberships");
      getLocalCollection("teamMembers");
      getLocalCollection("inquiries");
      getLocalCollection("siteSettings");
      getLocalCollection("blogs");
      getLocalCollection("testimonials");
      getLocalCollection("faqs");
      getLocalCollection("programs");
      getLocalCollection("publications");
      getLocalCollection("cloudinary_media");
      getLocalCollection("newsletters");
      console.log("Local Mock Database setup completed.");
    } else {
      authenticateServer(appInstance).then((authSuccess) => {
        if (authSuccess) {
          testConnection().then(() => seedDatabase());
        } else {
          console.error("Warning: Seeding skipped due to database authentication failure. Trying Mock DB fallback.");
          useLocalMockDb = true;
        }
      });
    }
  });
}

// --- API Endpoints ---

// 0.05 Cloudinary Upload Endpoint (secure server-side proxy)
app.post("/api/upload", async (req, res) => {
  try {
    const { file, folder, resource_type } = req.body;
    if (!file) {
      return res.status(400).json({ error: "File content is required" });
    }

    // Determine resource_type based on base64 content type prefix
    let clResourceUrl = "auto";
    if (resource_type) {
      clResourceUrl = resource_type;
    } else if (typeof file === "string") {
      if (file.startsWith("data:video/")) {
        clResourceUrl = "video";
      } else if (file.startsWith("data:application/pdf") || file.startsWith("data:application/")) {
        clResourceUrl = "raw";
      } else if (file.startsWith("data:image/")) {
        clResourceUrl = "image";
      }
    }

    console.log("Uploading file to Cloudinary with resource type:", clResourceUrl);

    // Upload base64 or url to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: folder || "mathscouncil",
      resource_type: clResourceUrl as any,
    });

    res.json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
    });
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ error: error.message || "Failed to upload file to Cloudinary" });
  }
});

// 0. Firebase Configuration Delivery for Client SDK
app.get("/api/firebase-config", (req, res) => {
  res.json({
    ...firebaseConfig,
    firestoreEmulatorHost: process.env.FIRESTORE_EMULATOR_HOST,
    authEmulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST
  });
});

// 0.5. Get current user's memberships
app.get("/api/memberships/my", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email query parameter is required" });
    }
    const q = query(
      collection(firebaseDb, "memberships"),
      where("email", "==", email)
    );
    const snapshot = await getDocs(q);
    const memberships = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    memberships.sort((a: any, b: any) => b.submittedAt.localeCompare(a.submittedAt));
    res.json(memberships);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "memberships");
    res.status(500).json({ error: "Failed to fetch user memberships" });
  }
});

// 1. Memberships
app.get("/api/memberships", async (req, res) => {
  try {
    const q = query(collection(firebaseDb, "memberships"));
    const snapshot = await getDocs(q);
    const memberships = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort descending by submittedAt
    memberships.sort((a: any, b: any) => b.submittedAt.localeCompare(a.submittedAt));
    res.json(memberships);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "memberships");
    res.status(500).json({ error: "Failed to fetch memberships" });
  }
});

app.post("/api/memberships", async (req, res) => {
  try {
    const form = req.body;
    const snapshot = await getDocs(collection(firebaseDb, "memberships"));
    const serialNo = `MEC-2026-${String(snapshot.size + 1).padStart(4, "0")}`;
    const id = `mem_${Date.now()}`;
    const newMembership = {
      ...form,
      id,
      serialNo,
      status: "Pending",
      submittedAt: new Date().toISOString()
    };
    await setDoc(doc(firebaseDb, "memberships", id), newMembership);
    res.status(201).json({ success: true, data: newMembership });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "memberships");
    res.status(500).json({ error: "Failed to create membership application" });
  }
});

app.patch("/api/memberships/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const docRef = doc(firebaseDb, "memberships", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Membership application not found" });
    }

    const data = docSnap.data();
    const updateData: any = { status };

    if (status === "Approved" && !data.membershipId) {
      const typeLetter = (data.membershipType && data.membershipType[0]) ? data.membershipType[0].toUpperCase() : 'G';
      const year = new Date().getFullYear();
      const snapshot = await getDocs(collection(firebaseDb, "memberships"));
      const approvedCount = snapshot.docs.filter(d => d.data().status === "Approved").length;
      updateData.membershipId = `CME-${typeLetter}-${year}-${String(approvedCount + 1).padStart(4, "0")}`;
    }

    await updateDoc(docRef, updateData);
    res.json({ success: true, data: { ...data, ...updateData } });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `memberships/${req.params.id}`);
    res.status(500).json({ error: "Failed to update membership status" });
  }
});

// 2. Team Members
app.get("/api/team", async (req, res) => {
  try {
    const q = query(collection(firebaseDb, "teamMembers"), where("status", "==", "Approved"));
    const snapshot = await getDocs(q);
    const team = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(team);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "teamMembers");
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

app.get("/api/admin/team", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "teamMembers"));
    const team = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort descending by submittedAt
    team.sort((a: any, b: any) => b.submittedAt.localeCompare(a.submittedAt));
    res.json(team);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "teamMembers");
    res.status(500).json({ error: "Failed to fetch admin team members" });
  }
});

app.post("/api/team/apply", async (req, res) => {
  try {
    const form = req.body;
    const id = `team_${Date.now()}`;
    const newMember = {
      ...form,
      id,
      status: "Pending",
      submittedAt: new Date().toISOString()
    };
    await setDoc(doc(firebaseDb, "teamMembers", id), newMember);
    res.status(201).json({ success: true, data: newMember });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "teamMembers");
    res.status(500).json({ error: "Failed to apply for team membership" });
  }
});

app.patch("/api/team/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, role, category } = req.body;

    const docRef = doc(firebaseDb, "teamMembers", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Team member application not found" });
    }

    const updateData: any = {};
    if (status !== undefined) {
      if (!["Approved", "Rejected", "Pending"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      updateData.status = status;
    }
    if (role !== undefined) updateData.role = role;
    if (category !== undefined) updateData.category = category;

    await updateDoc(docRef, updateData);
    res.json({ success: true, data: { ...docSnap.data(), ...updateData } });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `teamMembers/${req.params.id}`);
    res.status(500).json({ error: "Failed to update team member status" });
  }
});

// 3. Inquiries
app.get("/api/inquiries", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "inquiries"));
    const inquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort descending by submittedAt
    inquiries.sort((a: any, b: any) => b.submittedAt.localeCompare(a.submittedAt));
    res.json(inquiries);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "inquiries");
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

app.post("/api/inquiry", async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ error: "Please fill in all inquiry fields" });
    }

    const id = `inq_${Date.now()}`;
    const newInquiry = {
      id,
      fullName,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString()
    };
    await setDoc(doc(firebaseDb, "inquiries", id), newInquiry);
    res.status(201).json({ success: true, data: newInquiry });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "inquiries");
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

// 4. Site Settings
app.get("/api/settings", async (req, res) => {
  try {
    const docRef = doc(firebaseDb, "siteSettings", "current");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.json(docSnap.data());
    } else {
      res.json(INITIAL_DATA.siteSettings);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "siteSettings/current");
    res.status(500).json({ error: "Failed to fetch site settings" });
  }
});

app.put("/api/settings", async (req, res) => {
  try {
    const docRef = doc(firebaseDb, "siteSettings", "current");
    const docSnap = await getDoc(docRef);
    const existingData = docSnap.exists() ? docSnap.data() : INITIAL_DATA.siteSettings;
    const newData = { ...existingData, ...req.body };
    await setDoc(docRef, newData);
    res.json({ success: true, data: newData });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "siteSettings/current");
    res.status(500).json({ error: "Failed to update site settings" });
  }
});

// 5. Blog & News
app.get("/api/blogs", async (req, res) => {
  try {
    const q = query(collection(firebaseDb, "blogs"), where("status", "==", "Published"));
    const snapshot = await getDocs(q);
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by date descending
    blogs.sort((a: any, b: any) => b.date.localeCompare(a.date));
    res.json(blogs);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "blogs");
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

app.get("/api/admin/blogs", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "blogs"));
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by date descending
    blogs.sort((a: any, b: any) => b.date.localeCompare(a.date));
    res.json(blogs);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "blogs");
    res.status(500).json({ error: "Failed to fetch admin blogs" });
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const id = `blog_${Date.now()}`;
    const newBlog = {
      ...req.body,
      id,
      date: req.body.date || new Date().toISOString().split("T")[0]
    };
    await setDoc(doc(firebaseDb, "blogs", id), newBlog);
    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "blogs");
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

app.put("/api/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "blogs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    const updated = { ...docSnap.data(), ...req.body, id };
    await setDoc(docRef, updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `blogs/${req.params.id}`);
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "blogs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    await deleteDoc(docRef);
    res.json({ success: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `blogs/${req.params.id}`);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

// 6. Testimonials
app.get("/api/testimonials", async (req, res) => {
  try {
    const q = query(collection(firebaseDb, "testimonials"), where("status", "==", "Approved"));
    const snapshot = await getDocs(q);
    const testimonials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort descending by date
    testimonials.sort((a: any, b: any) => b.date.localeCompare(a.date));
    res.json(testimonials);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "testimonials");
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

app.get("/api/admin/testimonials", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "testimonials"));
    const testimonials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort descending by date
    testimonials.sort((a: any, b: any) => b.date.localeCompare(a.date));
    res.json(testimonials);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "testimonials");
    res.status(500).json({ error: "Failed to fetch admin testimonials" });
  }
});

app.post("/api/testimonials", async (req, res) => {
  try {
    const id = `test_${Date.now()}`;
    const newTestimonial = {
      ...req.body,
      id,
      status: req.body.status || "Pending",
      rating: Number(req.body.rating) || 5,
      date: req.body.date || new Date().toISOString().split("T")[0]
    };
    await setDoc(doc(firebaseDb, "testimonials", id), newTestimonial);
    res.status(201).json({ success: true, data: newTestimonial });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "testimonials");
    res.status(500).json({ error: "Failed to submit testimonial" });
  }
});

app.patch("/api/testimonials/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const docRef = doc(firebaseDb, "testimonials", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    await updateDoc(docRef, { status });
    res.json({ success: true, data: { ...docSnap.data(), status } });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `testimonials/${req.params.id}`);
    res.status(500).json({ error: "Failed to update testimonial status" });
  }
});

app.put("/api/testimonials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "testimonials", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    const updated = { ...docSnap.data(), ...req.body, id };
    await setDoc(docRef, updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `testimonials/${req.params.id}`);
    res.status(500).json({ error: "Failed to update testimonial" });
  }
});

app.delete("/api/testimonials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "testimonials", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    await deleteDoc(docRef);
    res.json({ success: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `testimonials/${req.params.id}`);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

// 8. Registered Users Custom Profile Index
app.get("/api/users", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "users"));
    const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    usersList.sort((a: any, b: any) => {
      const dateA = a.registeredAt || "";
      const dateB = b.registeredAt || "";
      return dateB.localeCompare(dateA);
    });
    res.json(usersList);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "users");
    res.status(500).json({ error: "Failed to fetch registered users" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { email, fullName, phoneNumber } = req.body;
    if (!email || !fullName) {
      return res.status(400).json({ error: "Email and Full Name are required" });
    }
    const cleanEmail = email.trim().toLowerCase();
    const id = cleanEmail.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const docRef = doc(firebaseDb, "users", id);
    const existingSnap = await getDoc(docRef);

    let finalPhone = (phoneNumber || "").trim();
    let finalName = fullName.trim();
    let finalRegTime = new Date().toISOString();

    if (existingSnap.exists()) {
      const existingData = existingSnap.data();
      // Keep existing phone if not provided in the new request
      if (!finalPhone && existingData.phoneNumber) {
        finalPhone = existingData.phoneNumber;
      }
      // Keep existing name if current name is just a placeholder (like part of the email) and existing name is real
      if (finalName === cleanEmail.split("@")[0] && existingData.fullName) {
        finalName = existingData.fullName;
      }
      if (existingData.registeredAt) {
        finalRegTime = existingData.registeredAt;
      }
    }

    const userData = {
      id,
      email: cleanEmail,
      fullName: finalName,
      phoneNumber: finalPhone,
      registeredAt: finalRegTime
    };

    await setDoc(docRef, userData);
    res.status(201).json({ success: true, data: userData });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "users");
    res.status(500).json({ error: "Failed to register user details" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "users", id);
    await deleteDoc(docRef);
    res.json({ success: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${req.params.id}`);
    res.status(500).json({ error: "Failed to delete user profile" });
  }
});

// 7. FAQs
app.get("/api/faqs", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "faqs"));
    const faqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    faqs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    res.json(faqs);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "faqs");
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

app.post("/api/faqs", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "faqs"));
    const id = `faq_${Date.now()}`;
    const newFaq = {
      ...req.body,
      id,
      order: Number(req.body.order) || (snapshot.size + 1)
    };
    await setDoc(doc(firebaseDb, "faqs", id), newFaq);
    res.status(201).json({ success: true, data: newFaq });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "faqs");
    res.status(500).json({ error: "Failed to create FAQ" });
  }
});

app.put("/api/faqs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "faqs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "FAQ not found" });
    }
    const updated = { ...docSnap.data(), ...req.body, id };
    await setDoc(docRef, updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `faqs/${req.params.id}`);
    res.status(500).json({ error: "Failed to update FAQ" });
  }
});

app.delete("/api/faqs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "faqs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "FAQ not found" });
    }
    await deleteDoc(docRef);
    res.json({ success: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `faqs/${req.params.id}`);
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
});

// --- PROGRAMS API ---
app.get("/api/programs", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "programs"));
    if (snapshot.empty) {
      return res.json([]);
    }
    const programs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    programs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    res.json(programs);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "programs");
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

app.post("/api/programs", async (req, res) => {
  try {
    const id = `prog_${Date.now()}`;
    const newProg = {
      ...req.body,
      id,
      order: Number(req.body.order) || Date.now()
    };
    await setDoc(doc(firebaseDb, "programs", id), newProg);
    res.status(201).json({ success: true, data: newProg });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "programs");
    res.status(500).json({ error: "Failed to create program" });
  }
});

app.put("/api/programs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "programs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Program not found" });
    }
    const updated = { ...docSnap.data(), ...req.body, id };
    await setDoc(docRef, updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `programs/${req.params.id}`);
    res.status(500).json({ error: "Failed to update program" });
  }
});

app.delete("/api/programs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "programs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Program not found" });
    }
    await deleteDoc(docRef);
    res.json({ success: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `programs/${req.params.id}`);
    res.status(500).json({ error: "Failed to delete program" });
  }
});

// --- PUBLICATIONS API ---
app.get("/api/publications", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "publications"));
    if (snapshot.empty) {
      return res.json([]);
    }
    const publications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    publications.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    res.json(publications);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "publications");
    res.status(500).json({ error: "Failed to fetch publications" });
  }
});

app.post("/api/publications", async (req, res) => {
  try {
    const id = `pub_${Date.now()}`;
    const newPub = {
      ...req.body,
      id,
      order: Number(req.body.order) || Date.now()
    };
    await setDoc(doc(firebaseDb, "publications", id), newPub);
    res.status(201).json({ success: true, data: newPub });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "publications");
    res.status(500).json({ error: "Failed to create publication" });
  }
});

app.put("/api/publications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "publications", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Publication not found" });
    }
    const updated = { ...docSnap.data(), ...req.body, id };
    await setDoc(docRef, updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `publications/${req.params.id}`);
    res.status(500).json({ error: "Failed to update publication" });
  }
});

app.delete("/api/publications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "publications", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Publication not found" });
    }
    await deleteDoc(docRef);
    res.json({ success: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `publications/${req.params.id}`);
    res.status(500).json({ error: "Failed to delete publication" });
  }
});

// 8. Persistent Cloudinary Media Registry
app.get("/api/media", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "cloudinary_media"));
    const media = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort descending by uploadedAt
    media.sort((a: any, b: any) => (b.uploadedAt || "").localeCompare(a.uploadedAt || ""));
    res.json(media);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "cloudinary_media");
    res.status(500).json({ error: "Failed to fetch media library items" });
  }
});

app.post("/api/media", async (req, res) => {
  try {
    const id = `media_${Date.now()}`;
    const newMedia = {
      ...req.body,
      id,
      uploadedAt: new Date().toISOString()
    };
    await setDoc(doc(firebaseDb, "cloudinary_media", id), newMedia);
    res.status(201).json({ success: true, data: newMedia });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "cloudinary_media");
    res.status(500).json({ error: "Failed to log media library item" });
  }
});

app.delete("/api/media/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "cloudinary_media", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Media item not found" });
    }
    await deleteDoc(docRef);
    res.json({ success: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `cloudinary_media/${req.params.id}`);
    res.status(500).json({ error: "Failed to remove media item" });
  }
});

// --- DYNAMIC BLOGS AND SOCIAL MEDIA SHARING SECTOR ---

// Fetch single blog post details
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "blogs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

// Increment post view / watch count
app.post("/api/blogs/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "blogs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    const currentData = docSnap.data();
    const currentCount = typeof currentData.watchCount === "number" ? currentData.watchCount : 0;
    const updatedCount = currentCount + 1;
    await updateDoc(docRef, { watchCount: updatedCount });
    res.json({ success: true, watchCount: updatedCount });
  } catch (error) {
    console.error("Error updating watchCount:", error);
    res.status(500).json({ error: "Failed to update watch count" });
  }
});

// --- SEO META API ---
app.get("/api/seo", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "seoMeta"));
    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(records);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "seoMeta");
    res.status(500).json({ error: "Failed to fetch SEO settings" });
  }
});

app.post("/api/seo", async (req, res) => {
  try {
    const payload = req.body;
    const { id } = payload;
    if (!id) {
      return res.status(400).json({ error: "Route ID is required" });
    }
    await setDoc(doc(firebaseDb, "seoMeta", id), payload);
    res.status(200).json({ success: true, data: payload });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `seoMeta/${req.body.id}`);
    res.status(500).json({ error: "Failed to update SEO settings" });
  }
});

// --- NEWSLETTER SUBSCRIPTION API ---
app.post("/api/newsletter/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    const cleanEmail = email.trim().toLowerCase();
    const id = cleanEmail.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const newSub = {
      id,
      email: cleanEmail,
      subscribedAt: new Date().toISOString()
    };
    await setDoc(doc(firebaseDb, "subscribers", id), newSub);
    res.status(200).json({ success: true, message: "Successfully subscribed to our newsletter!" });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `subscribers`);
    res.status(500).json({ error: "Failed to process newsletter subscription." });
  }
});

// --- 7.5 BULK EMAIL NEWSLETTER AND CAMPAGINS SECTOR ---
app.get("/api/admin/newsletters", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firebaseDb, "newsletters"));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort descending by sentAt
    list.sort((a: any, b: any) => (b.sentAt || "").localeCompare(a.sentAt || ""));
    res.json(list);
  } catch (error) {
    console.error("Failed to fetch newsletters:", error);
    res.status(500).json({ error: "Failed to fetch newsletter campaign history." });
  }
});

app.post("/api/admin/newsletters/send", async (req, res) => {
  try {
    const { subject, content, targetAudience, templateName, customEmails } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ error: "Subject and Content are required." });
    }

    // 1. Fetch relevant member emails based on targetAudience or use custom input
    let emails: string[] = [];
    if (targetAudience === "custom") {
      if (!customEmails || typeof customEmails !== "string" || !customEmails.trim()) {
        return res.status(400).json({ error: "Please enter at least one custom email address." });
      }
      emails = customEmails
        .split(/[\s,;]+/)
        .map(e => e.trim())
        .filter(e => e.includes("@") && e.length > 3);
    } else {
      if (!firebaseDb) {
        return res.status(500).json({ error: "Firestore database is not initialized." });
      }
      const snapshot = await getDocs(collection(firebaseDb, "memberships"));
      const allMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

      let filteredMembers = allMembers;
      if (targetAudience === "approved") {
        filteredMembers = allMembers.filter(m => m.status === "Approved");
      } else if (targetAudience === "pending") {
        filteredMembers = allMembers.filter(m => m.status === "Pending");
      } else if (targetAudience === "life") {
        filteredMembers = allMembers.filter(m => m.membershipType === "Life");
      } else if (targetAudience === "general") {
        filteredMembers = allMembers.filter(m => m.membershipType === "General");
      }

      emails = filteredMembers
        .map(m => m.email)
        .filter((email): email is string => typeof email === "string" && email.trim().length > 0);
    }

    if (emails.length === 0) {
      return res.status(400).json({ error: "No valid recipient email addresses found for the selected target audience." });
    }

    // 2. Set up Nodemailer transporter (Nodemailer uses env values, otherwise logs a mock success)
    let transporter: any = null;
    let isRealDelivery = false;
    let deliveryMessage = "Simulated delivery completed successfully (no SMTP credentials configured in .env).";

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"Nepal Mathematics Council" <noreply@cme.org.np>`;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const isGmail = smtpHost.toLowerCase().includes("gmail.com") || smtpUser.toLowerCase().includes("gmail.com");
        const transportConfig: any = isGmail ? {
          service: "gmail",
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        } : {
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 10000
        };

        transporter = nodemailer.createTransport(transportConfig);

        // Handle any async stream errors to prevent background socket crashes
        if (transporter && typeof transporter.on === "function") {
          transporter.on("error", (err: any) => {
            console.error("Nodemailer transporter background stream error:", err);
          });
        }

        isRealDelivery = true;
      } catch (err) {
        console.error("Nodemailer transporter build failure:", err);
      }
    }

    let status = "Sent";
    if (isRealDelivery && transporter) {
      try {
        // Send email individually or as BCC to avoid leaking recipient list
        await transporter.sendMail({
          from: smtpFrom,
          bcc: emails.join(","),
          subject: subject,
          html: content
        });
        deliveryMessage = `Real email delivered successfully to ${emails.length} recipients via SMTP server.`;
      } catch (err: any) {
        console.error("Nodemailer real transmission failed:", err);
        status = "Failed";
        deliveryMessage = `Failed to deliver via SMTP: ${err.message || String(err)}`;
      }
    }

    // 3. Log campaign history to Firestore (newsletters collection)
    const id = `news_${Date.now()}`;
    const newNewsletter = {
      id,
      subject,
      content,
      sentAt: new Date().toISOString(),
      recipientsCount: emails.length,
      recipientEmails: emails.join(", "),
      templateName: templateName || "Custom Template",
      status,
      targetAudience: targetAudience || "all"
    };

    if (firebaseDb) {
      try {
        await setDoc(doc(firebaseDb, "newsletters", id), newNewsletter);
      } catch (fsErr: any) {
        console.error("Failed to log newsletter campaign to Firestore database:", fsErr);
        // Note: Do not throw or fail the email request if only firestore logging fails
      }
    }

    res.json({
      success: status === "Sent",
      data: newNewsletter,
      deliveryMessage,
      recipients: emails,
      error: status === "Failed" ? deliveryMessage : undefined
    });
  } catch (error: any) {
    console.error("Failed to send newsletter campaign:", error);
    res.status(500).json({
      error: `Internal server error during newsletter distribution: ${error.message || String(error)}`
    });
  }
});

// Dynamic metadata crawler bypass route for single blog shares
app.get("/blog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(firebaseDb, "blogs", id);
    const docSnap = await getDoc(docRef);

    let title = "Council for Mathematics Education (CME) | Nepal";
    let desc = "The Council for Mathematics Education (CME) is Nepal's pioneer government-recognized academic society.";
    let imageUrl = "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800";

    if (docSnap.exists()) {
      const blogData = docSnap.data();
      title = `${blogData.title} | Blogs & News | CME Nepal`;
      desc = blogData.excerpt || (blogData.content ? blogData.content.substring(0, 150) + "..." : desc);
      imageUrl = blogData.imageUrl || imageUrl;
    }

    const isProd = process.env.NODE_ENV === "production";
    const templatePath = isProd
      ? path.join(process.cwd(), "dist", "index.html")
      : path.join(process.cwd(), "index.html");

    if (fs.existsSync(templatePath)) {
      let html = fs.readFileSync(templatePath, "utf-8");

      // Replace default page title
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

      // Inject Open Graph tags for WhatsApp, Discord, Facebook, X crawlers
      const metaTags = `
        <!-- Custom Dynamic Social Share Tags for CME Blog Posts -->
        <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
        <meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="CME Nepal" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
        <meta name="twitter:description" content="${desc.replace(/"/g, '&quot;')}" />
        <meta name="twitter:image" content="${imageUrl}" />
      `;

      html = html.replace("</head>", `${metaTags}</head>`);
      res.setHeader("Content-Type", "text/html");
      return res.send(html);
    }

    res.status(500).send("Index template missing");
  } catch (err) {
    console.error("Error serving SEO share page:", err);
    res.status(500).send("Internal server error");
  }
});

// Blogs directory list view fallback
app.get("/blogs", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  const templatePath = isProd
    ? path.join(process.cwd(), "dist", "index.html")
    : path.join(process.cwd(), "index.html");
  if (fs.existsSync(templatePath)) {
    res.setHeader("Content-Type", "text/html");
    return res.sendFile(templatePath);
  }
  res.status(500).send("Index template missing");
});

// Start the server depending on Node Environment
async function startServer() {
  if (process.env.VERCEL) {
    console.log("Running in Vercel Serverless environment. Skipping app.listen().");
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    // In dev environment, mount Vite middleware to serve client files
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started successfully on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

export default app;

