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
          from: 'AI Sprint Studio <info@aisprintstudio.com>',
          replyTo: 'info@aisprintstudio.com',
          to: 'gtcroon@gmail.com',
          subject: `Nieuwe Quick Scan Aanvraag: ${body.name}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #303034; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 0 auto; background: #E4DAD0; }
                  .header { background: #DB4A2B; color: white; padding: 30px; text-align: center; }
                  .content { background: #E4DAD0; padding: 30px; }
                  .info-box { background: white; padding: 20px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #DB4A2B; }
                  .label { font-weight: 600; color: #DB4A2B; margin-bottom: 5px; font-size: 14px; }
                  .value { color: #303034; }
                  .footer { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #D4CACA; }
                  .logo { margin: 20px 0; }
                  .logo-text { font-size: 18px; font-weight: bold; color: #303034; }
                  .logo-text .primary { color: #DB4A2B; }
                  .logo-text .italic { font-style: italic; font-weight: normal; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 24px;">🎯 Nieuwe Quick Scan Aanvraag</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Er is een nieuwe aanvraag binnengekomen</p>
                  </div>
                  <div class="content">
                    <div class="info-box">
                      <div class="label">Naam</div>
                      <div class="value">${body.name}</div>
                    </div>
                    <div class="info-box">
                      <div class="label">Email</div>
                      <div class="value"><a href="mailto:${body.email}" style="color: #DB4A2B;">${body.email}</a></div>
                    </div>
                    <div class="info-box">
                      <div class="label">Bedrijfswebsite</div>
                      <div class="value"><a href="${body.website}" target="_blank" style="color: #DB4A2B;">${body.website}</a></div>
                    </div>
                    ${body.challenge ? `
                    <div class="info-box">
                      <div class="label">Grootste Uitdaging</div>
                      <div class="value">${body.challenge.replace(/\n/g, '<br>')}</div>
                    </div>
                    ` : ''}
                    <div class="info-box">
                      <div class="label">Submission ID</div>
                      <div class="value" style="font-family: monospace; font-size: 12px; color: #6B6568;">${data.id}</div>
                    </div>
                    <div class="footer">
                      <div class="logo">
                        <div class="logo-text">
                          <span>AI</span><span class="primary">SPRINT</span><span class="italic">studio</span>
                        </div>
                      </div>
                      <p style="color: #6B6568; font-size: 12px; margin: 10px 0;">
                        <a href="https://aisprintstudio.com" style="color: #DB4A2B; text-decoration: none;">aisprintstudio.com</a>
                      </p>
                      <p style="color: #6B6568; font-size: 12px; margin: 5px 0;">
                        Verzonden op ${new Date().toLocaleString('nl-NL')}
                      </p>
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
          from: 'AI Sprint Studio <info@aisprintstudio.com>',
          replyTo: 'gtcroon@gmail.com',
          to: body.email,
          subject: 'Bedankt voor je Quick Scan aanvraag! 🎯',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #303034; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 0 auto; background: #E4DAD0; }
                  .header { background: #DB4A2B; color: white; padding: 30px; text-align: center; }
                  .content { background: #E4DAD0; padding: 30px; }
                  .highlight-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #DB4A2B; }
                  .footer { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #D4CACA; }
                  .logo { margin: 20px 0; }
                  .logo-text { font-size: 18px; font-weight: bold; color: #303034; }
                  .logo-text .primary { color: #DB4A2B; }
                  .logo-text .italic { font-style: italic; font-weight: normal; }
                  a { color: #DB4A2B; text-decoration: none; }
                  a:hover { text-decoration: underline; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 24px;">🎉 Bedankt, ${body.name}!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Je Quick Scan aanvraag is ontvangen</p>
                  </div>
                  <div class="content">
                    <p style="margin-top: 0;">Hoi ${body.name},</p>
                    <p>Bedankt voor je interesse in AI automation voor <strong>${body.website}</strong>!</p>
                    
                    <div class="highlight-box">
                      <h3 style="margin-top: 0; color: #DB4A2B; font-size: 18px;">Wat gebeurt er nu?</h3>
                      <p style="margin-bottom: 10px;">We gaan direct aan de slag met het analyseren van je website en bedrijf. Binnen <strong>48 uur</strong> ontvang je van ons:</p>
                      <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">✅ 3-5 concrete AI automation mogelijkheden specifiek voor jouw bedrijf</li>
                        <li style="margin-bottom: 8px;">✅ Inschatting van tijdsbesparing en ROI</li>
                        <li>✅ Praktische voorbeelden van hoe dit eruit ziet</li>
                      </ul>
                    </div>

                    <p>Geen verplichtingen, geen salesgesprek - gewoon waardevolle inzichten die je direct kunt gebruiken.</p>
                    
                    <p>Heb je vragen? Stuur gerust een email naar <a href="mailto:info@aisprintstudio.com">info@aisprintstudio.com</a></p>
                    
                    <p>Met vriendelijke groet,<br>
                    <strong>Het AI Sprint Studio Team</strong></p>
                    
                    <div class="footer">
                      <div class="logo">
                        <div class="logo-text">
                          <span>AI</span><span class="primary">SPRINT</span><span class="italic">studio</span>
                        </div>
                      </div>
                      <p style="color: #6B6568; font-size: 12px; margin: 10px 0;">
                        <a href="https://aisprintstudio.com" style="color: #DB4A2B;">aisprintstudio.com</a>
                      </p>
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

