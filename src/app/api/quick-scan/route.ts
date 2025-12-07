import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

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

    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase environment variables not configured');
      return NextResponse.json(
        { error: 'Database niet geconfigureerd. Neem contact op met de beheerder.' },
        { status: 500 }
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
      
      // Check if table doesn't exist
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { error: 'Database tabel bestaat nog niet. Voer eerst het SQL script uit in Supabase.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Er ging iets mis bij het opslaan: ${error.message || 'Onbekende fout'}` },
        { status: 500 }
      );
    }

    // Send notification email to team
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'AI Sprint Studio <noreply@aisprintstudio.nl>',
          to: 'gtcroon@gmail.com',
          subject: `Nieuwe Quick Scan Aanvraag: ${body.name}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                  .info-box { background: white; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #667eea; }
                  .label { font-weight: 600; color: #667eea; margin-bottom: 5px; }
                  .value { color: #1f2937; }
                  .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0;">🎯 Nieuwe Quick Scan Aanvraag</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Er is een nieuwe aanvraag binnengekomen</p>
                  </div>
                  <div class="content">
                    <div class="info-box">
                      <div class="label">Naam</div>
                      <div class="value">${body.name}</div>
                    </div>
                    <div class="info-box">
                      <div class="label">Email</div>
                      <div class="value"><a href="mailto:${body.email}">${body.email}</a></div>
                    </div>
                    <div class="info-box">
                      <div class="label">Bedrijfswebsite</div>
                      <div class="value"><a href="${body.website}" target="_blank">${body.website}</a></div>
                    </div>
                    ${body.challenge ? `
                    <div class="info-box">
                      <div class="label">Grootste Uitdaging</div>
                      <div class="value">${body.challenge.replace(/\n/g, '<br>')}</div>
                    </div>
                    ` : ''}
                    <div class="info-box">
                      <div class="label">Submission ID</div>
                      <div class="value" style="font-family: monospace; font-size: 12px;">${data.id}</div>
                    </div>
                    <div class="footer">
                      <p>Verzonden op ${new Date().toLocaleString('nl-NL')}</p>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
        console.log('Notification email sent successfully');
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.warn('RESEND_API_KEY not configured, skipping email notification');
    }

    // Send confirmation email to client
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'AI Sprint Studio <noreply@aisprintstudio.nl>',
          to: body.email,
          subject: 'Bedankt voor je Quick Scan aanvraag! 🎯',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                  .highlight-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea; }
                  .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0;">🎉 Bedankt, ${body.name}!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Je Quick Scan aanvraag is ontvangen</p>
                  </div>
                  <div class="content">
                    <p>Hoi ${body.name},</p>
                    <p>Bedankt voor je interesse in AI automation voor <strong>${body.website}</strong>!</p>
                    
                    <div class="highlight-box">
                      <h3 style="margin-top: 0; color: #667eea;">Wat gebeurt er nu?</h3>
                      <p>We gaan direct aan de slag met het analyseren van je website en bedrijf. Binnen <strong>48 uur</strong> ontvang je van ons:</p>
                      <ul>
                        <li>✅ 3-5 concrete AI automation mogelijkheden specifiek voor jouw bedrijf</li>
                        <li>✅ Inschatting van tijdsbesparing en ROI</li>
                        <li>✅ Praktische voorbeelden van hoe dit eruit ziet</li>
                      </ul>
                    </div>

                    <p>Geen verplichtingen, geen salesgesprek - gewoon waardevolle inzichten die je direct kunt gebruiken.</p>
                    
                    <p>Heb je vragen? Stuur gerust een email naar <a href="mailto:info@aisprintstudio.nl">info@aisprintstudio.nl</a></p>
                    
                    <p>Met vriendelijke groet,<br>
                    <strong>Het AI Sprint Studio Team</strong></p>
                    
                    <div class="footer">
                      <p>AI Sprint Studio | <a href="https://aisprintstudio.nl">aisprintstudio.nl</a></p>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
        console.log('Confirmation email sent to client');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the request if email fails
      }
    }

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

