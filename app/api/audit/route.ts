import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * POST /api/audit
 * 
 * Save an audit result to Supabase
 * 
 * Request body:
 * {
 *   teamSize: number
 *   teamType: string
 *   primaryUseCase: string
 *   tools: object[]
 *   currentMonthlySpend: number
 *   optimizedMonthlySpend: number
 *   monthlySavings: number
 *   annualSavings: number
 *   savingsRate: number
 *   summary: string
 *   recommendations: object[]
 *   isPublic: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.teamSize || !body.teamType || !body.primaryUseCase) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique report ID
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Graceful fallback mode for demo deployments without Supabase
    if (!supabase) {
      return NextResponse.json({
        success: true,
        fallbackMode: true,
        message: "Demo mode active",
        data: body,
      });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("audits")
      .insert({
        id: uuidv4(),
        report_id: reportId,
        team_size: body.teamSize,
        team_type: body.teamType,
        primary_use_case: body.primaryUseCase,
        tools: body.tools,
        current_monthly_spend: body.currentMonthlySpend,
        optimized_monthly_spend: body.optimizedMonthlySpend,
        monthly_savings: body.monthlySavings,
        annual_savings: body.annualSavings,
        savings_rate: body.savingsRate,
        summary: body.summary,
        recommendations: body.recommendations,
        is_public: body.isPublic ?? false,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("[StackSpend] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save audit" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reportId,
      data,
    });
  } catch (error) {
    console.error("[StackSpend] Audit API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
