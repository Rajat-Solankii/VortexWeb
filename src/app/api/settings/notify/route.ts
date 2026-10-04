import { NextResponse } from "next/server";
import { emitter } from "@/lib/events";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    if (payload.action === 'reload') {
      emitter.emit('maintenance_changed', 'reload');
      return NextResponse.json({ success: true });
    }

    const { value } = payload;
    // Broadcast the new setting to all connected SSE clients
    emitter.emit('maintenance_changed', String(value));
    
    return NextResponse.json({ success: true });
  } catch (err) {
    // Fallback if no json body is provided, just broadcast a reload
    emitter.emit('maintenance_changed', 'reload');
    return NextResponse.json({ success: true, warning: "No JSON body, defaulted to reload" });
  }
}
