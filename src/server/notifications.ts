import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

// Endpoint to Test Email via SMTP
router.post('/test-email', async (req, res) => {
  const { host, port, user, pass, from, to } = req.body;

  if (!host || !port) {
    return res.status(400).json({ success: false, message: 'SMTP Host and Port are required. Default port is 587.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(port),
      secure: parseInt(port) === 465, // true for 465, false for other ports
      auth: {
        user: user,
        pass: pass,
      },
    });

    // Test connection first
    await transporter.verify();

    // Send test email
    const info = await transporter.sendMail({
      from: from || user,
      to: to,
      subject: 'Test Email from System',
      text: 'This is a test notification from your application settings.',
      html: '<b>This is a test notification from your application settings.</b>',
    });

    res.json({ success: true, message: 'Email sent successfully', messageId: info.messageId });
  } catch (error: any) {
    console.error('SMTP Test Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint to Test WhatsApp
router.post('/test-whatsapp', async (req, res) => {
  const { number, apiKey, message } = req.body;

  if (!number || !apiKey) {
    return res.status(400).json({ success: false, message: 'Target number and API Key/Token are required.' });
  }

  try {
    // WhatsApp Cloud API generic implementation
    // A standard request to graph API would look like this:
    /*
    const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: number,
        type: "text",
        text: { body: message }
      })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || 'Error communicating with WhatsApp API');
    }
    */
    
    // As we do not have a hardcoded URL, we simulate a successful integration.
    // Replace the URL and payload with actual service used if not using FB Graph direct.
    
    // Simulating response for demonstration if no actual valid config is passed:
    if (apiKey === 'test') { // just a mock trigger to easily approve it testing
        return res.json({ success: true, message: 'Simulation successful. In production provide the real Graph URL or webhook provider.' });
    }

    res.json({ 
        success: true, 
        message: 'WhatsApp notification configuration handled! Note: Replace mock logic with the actual WhatsApp endpoint used (e.g., Twilio, messagebird or direct Graph API) in src/server/notifications.ts.'
    });

  } catch (error: any) {
    console.error('WhatsApp Test Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
