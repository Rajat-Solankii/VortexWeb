"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function MaintenanceWatcher() {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionRef = useRef(session);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    const eventSource = new EventSource('/api/settings/stream');

    eventSource.onmessage = (event) => {
      if (event.data === 'true' || event.data === 'reload') {
        // Maintenance mode turned ON or global reload triggered! Auto-reload.
        window.location.reload();
        return;
      }

      try {
        const payload = JSON.parse(event.data);
        if (payload.action === 'delete_account' && sessionRef.current?.user) {
          if ((sessionRef.current.user as any).id === payload.userId) {
            localStorage.removeItem("vortex_history");
            signOut({ callbackUrl: '/?deleted=true' });
          }
        }
      } catch (e) {
        // Not a JSON payload, ignore
      }
    };

    eventSource.onerror = () => {
      console.error("SSE connection lost. Reconnecting...");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return null; // This component is invisible
}
