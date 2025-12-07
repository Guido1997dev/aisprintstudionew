import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface QuickScanSubmission {
  name: string;
  email: string;
  website: string;
  challenge?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuickScanSubmission = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.website) {
      return NextResponse.json(
        { error: 'Naam, email en website zijn verplicht' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Ongeldig emailadres' },
        { status: 400 }
      );
    }

    // Validate website URL format
    try {
      new URL(body.website);
    } catch {
      return NextResponse.json(
        { error: 'Ongeldig website URL' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save to database
    const { data, error } = await supabase
      .from('quick_scan_submissions')
      .insert([
        {
          name: body.name,
          email: body.email,
          website: body.website,
          challenge: body.challenge || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving to database:', error);
      return NextResponse.json(
        { error: 'Er ging iets mis bij het opslaan' },
        { status: 500 }
      );
    }

    // TODO: Send notification email to team
    // TODO: Send confirmation email to client
    // This can be done via n8n webhook or email service

    // Optional: Trigger n8n webhook for team notification
    if (process.env.N8N_QUICK_SCAN_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_QUICK_SCAN_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: body.name,
            email: body.email,
            website: body.website,
            challenge: body.challenge,
            submission_id: data.id,
            submitted_at: data.created_at,
          }),
        });
      } catch (webhookError) {
        console.error('Error triggering n8n webhook:', webhookError);
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Quick scan aanvraag succesvol verzonden',
      data: {
        id: data.id,
        submitted_at: data.created_at,
      },
    });
  } catch (error) {
    console.error('Error processing quick scan submission:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het later opnieuw.' },
      { status: 500 }
    );
  }
}

