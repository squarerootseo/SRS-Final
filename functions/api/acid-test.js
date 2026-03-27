export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const formData = await context.request.formData();
    const data = Object.fromEntries(formData);

    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    const TO_EMAIL = context.env.TO_EMAIL || 'connect@squarerootseo.com';

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'API key not configured' }), {
        status: 500, headers: corsHeaders,
      });
    }

    // Build email HTML
    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#ec191e;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
          <h2 style="margin:0;">New A.C.I.D Test Request</h2>
          <p style="margin:5px 0 0;opacity:0.85;">Free SEO Audit Submission</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 8px;font-weight:bold;color:#374151;width:140px;">Full Name</td>
              <td style="padding:12px 8px;color:#111827;">${data.fullName || 'N/A'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 8px;font-weight:bold;color:#374151;">Company</td>
              <td style="padding:12px 8px;color:#111827;">${data.companyName || 'N/A'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 8px;font-weight:bold;color:#374151;">Website</td>
              <td style="padding:12px 8px;color:#111827;">${data.websiteUrl || 'N/A'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 8px;font-weight:bold;color:#374151;">WhatsApp</td>
              <td style="padding:12px 8px;color:#111827;">${data.whatsappNumber || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding:12px 8px;font-weight:bold;color:#374151;">Product/Sector</td>
              <td style="padding:12px 8px;color:#111827;">${data.productSector || 'Not specified'}</td>
            </tr>
          </table>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Square Root SEO <onboarding@resend.dev>',
        to: [TO_EMAIL],
        subject: `ACID Test Request from ${data.fullName || 'Website Visitor'} — ${data.companyName || ''}`,
        html: emailHtml,
      }),
    });

    const resBody = await res.text();

    if (!res.ok) {
      return new Response(JSON.stringify({ success: false, error: resBody }), {
        status: 500, headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: corsHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500, headers: corsHeaders,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
