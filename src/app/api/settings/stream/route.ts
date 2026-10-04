import { emitter } from "@/lib/events";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const stream = new ReadableStream({
    start(controller) {
      // Send the initial state upon connection
      try {
        const stmt = db.prepare("SELECT value FROM settings WHERE key = 'maintenance_mode'");
        const setting = stmt.get() as any;
        controller.enqueue(`data: ${setting?.value || 'false'}\n\n`);
      } catch (err) {
        // DB error?
      }

      const listener = (value: string) => {
        controller.enqueue(`data: ${value}\n\n`);
      };

      emitter.on('maintenance_changed', listener);

      req.signal.addEventListener('abort', () => {
        emitter.off('maintenance_changed', listener);
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
