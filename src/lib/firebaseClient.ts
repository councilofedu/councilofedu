import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export async function getFirebaseClient() {
  if (app && auth && db) {
    return { app, auth, db };
  }
  
  try {
    const response = await fetch("/api/firebase-config");
    if (!response.ok) {
      throw new Error("Failed to fetch firebase config");
    }
    const config = await response.json();
    if (!config || !config.apiKey) {
      throw new Error("Invalid firebase config received");
    }
    
    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    
    auth = getAuth(app);
    if (config.authEmulatorHost) {
      connectAuthEmulator(auth, `http://${config.authEmulatorHost}`);
      console.log("Client-side Firebase Auth connected to Emulator at:", config.authEmulatorHost);
    }
    
    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)" && config.firestoreDatabaseId !== "") {
      db = getFirestore(app, config.firestoreDatabaseId);
    } else {
      db = getFirestore(app);
    }
    if (config.firestoreEmulatorHost) {
      const [host, portStr] = config.firestoreEmulatorHost.split(":");
      connectFirestoreEmulator(db, host, parseInt(portStr || "8080", 10));
      console.log("Client-side Firestore connected to Emulator at:", config.firestoreEmulatorHost);
    }
    
    return { app, auth, db };
  } catch (error) {
    console.error("Failed to initialize client-side Firebase:", error);
    throw error;
  }
}
