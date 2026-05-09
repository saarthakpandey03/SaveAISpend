import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * POST /api/lead
 * 
 * Save a lead capture from audit results
 * 
 * Request body:
 * {
 *   auditId: string
 *   email: string
 *   companyName?: string
 *   role?: string
 *   teamSize?: number
 *   honeypot?: string (empty field for abuse protection)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.auditId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Honeypot field check (abuse protection)
    if (body.honeypot && body.honeypot.trim() !== "") {
      // Silently fail if honeypot is filled (likely a bot)
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("leads")
      .insert({
        id: uuidv4(),
        audit_id: body.auditId,
        email: body.email.toLowerCase(),
        company_name: body.companyName || null,
        role: body.role || null,
        team_size: body.teamSize || null,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("[StackSpend] Supabase lead insert error:", error);
      
      // If it's a duplicate email for the same audit, that's okay
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          message: "Lead already exists",
        });
      }

      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[StackSpend] Lead API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
