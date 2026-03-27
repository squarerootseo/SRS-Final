export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const data = Object.fromEntries(formData);

    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    const TO_EMAIL = context.env.TO_EMAIL || 'connect@squarerootseo.com';

    // Build email HTML
    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:#206dff;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
          <h2 style="margin:0;">📩 New Contact Form Submission</h2>
          <p style="margin:5px 0 0;opacity:0.85;">From squarerootseo.com Contact Page</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 8px;font-weight:bold;color:#374151;width:140px;">Full Name</td>
              <td style="padding:12px 8px;color:#111827;">${data.name || 'N/A'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 8px;font-weight:bold;color:#374151;">Company</td>
              <td style="padding:12px 8px;color:#111827;">${data.company || 'N/A'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 8px;font-weight:bold;color:#374151;">WhatsApp</td>
              <td style="padding:12px 8px;color:#111827;">${data.phone || 'N/A'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 8px;font-weight:bold;color:#374151;">Interested In</td>
              <td style="padding:12px 8px;color:#111827;">${data.service || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding:12px 8px;font-weight:bold;color:#374151;vertical-align:top;">Message</td>
              <td style="padding:12px 8px;color:#111827;">${data.message || 'No message'}</td>
            </tr>
          </table>
        </div>
        <p style="color:#9ca3af;font-size:12px;margin-top:16px;text-align:center;">
          Sent from srs-final.pages.dev — ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </div>
    `;

    // Send via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Square Root SEO <onboarding@resend.dev>',
        to: [TO_EMAIL],
        subject: `New Enquiry from ${data.name || 'Website Visitor'}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
