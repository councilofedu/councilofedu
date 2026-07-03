import React, { useState, useEffect, useRef } from "react";
import { Users, Wifi } from "lucide-react";
import { getFirebaseClient } from "../lib/firebaseClient";
import { doc, setDoc, deleteDoc, collection, query, where, onSnapshot } from "firebase/firestore";

interface ActiveVisitorsProps {
  currentView: string;
}

export default function ActiveVisitors({ currentView }: ActiveVisitorsProps) {
  const [activeCount, setActiveCount] = useState<number>(1);
  const [dbInstance, setDbInstance] = useState<any>(null);
  const sessionIdRef = useRef<string>("");

  // Get session ID (cached in sessionStorage to keep counts clean on refresh)
  useEffect(() => {
    let sessId = sessionStorage.getItem("cme_visitor_session_id");
    if (!sessId) {
      sessId = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
      sessionStorage.setItem("cme_visitor_session_id", sessId);
    }
    sessionIdRef.current = sessId;
  }, []);

  // Initialize Firebase client
  useEffect(() => {
    getFirebaseClient()
      .then(({ db }) => {
        setDbInstance(db);
      })
      .catch((err) => {
        console.warn("Firebase not ready or rules blocked for presence tracking:", err);
      });
  }, []);

  // Sync heartbeat and real-time count
  useEffect(() => {
    if (!dbInstance || !sessionIdRef.current) return;

    const db = dbInstance;
    const sessionId = sessionIdRef.current;
    const pageId = currentView || "home";

    // Immediate heartbeat write
    const writeHeartbeat = async () => {
      try {
        await setDoc(doc(db, "visitorPresence", sessionId), {
          page: pageId,
          lastActive: Date.now()
        }, { merge: true });
      } catch (err) {
        // Silent catch for permission / connection issues
      }
    };

    writeHeartbeat();

    // 10-second heartbeat interval
    const intervalId = setInterval(writeHeartbeat, 10000);

    // Set up real-time listener for current page visitors
    const q = query(collection(db, "visitorPresence"), where("page", "==", pageId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const now = Date.now();
        // Filter out stale visitors (inactive for > 30 seconds)
        const activeDocs = snapshot.docs.filter((d) => {
          const data = d.data();
          return data.lastActive && (now - data.lastActive < 30000);
        });
        
        // Ensure count is at least 1 (the current user)
        setActiveCount(Math.max(1, activeDocs.length));
      },
      (error) => {
        console.warn("Presence sub error:", error);
      }
    );

    // Clean up on unmount or view change
    return () => {
      clearInterval(intervalId);
      unsubscribe();
      
      // Delete presence record or update it as departed
      deleteDoc(doc(db, "visitorPresence", sessionId)).catch(() => {
        // Silent catch on network close
      });
    };
  }, [dbInstance, currentView]);

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#e3f2fd] text-[#1e5894] border border-[#bbdefb] text-[10px] font-bold uppercase tracking-wider transition-all animate-pulse"
      id="realtime-visitor-indicator"
      title="Real-time active users on this section"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1e5894] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1e5894]"></span>
      </span>
      <span className="flex items-center gap-1 font-mono">
        <Users className="w-3 h-3 text-amber-500 shrink-0" />
        <span>{activeCount} {activeCount === 1 ? "Active User" : "Active Users"} Now</span>
      </span>
    </div>
  );
}
