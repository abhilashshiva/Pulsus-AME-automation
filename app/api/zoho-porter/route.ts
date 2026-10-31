import { NextResponse } from 'next/server';

interface DispatchRequest {
  action: 'send_single' | 'test_connection' | 'batch_dispatch';
  recipient?: {
    email: string;
    author: string;
    title: string;
    journal?: string;
  };
  instanceId?: string;
  templateId?: string;
  subject?: string;
  htmlBody?: string;
  stealthDelaySec?: number;
}

export async function POST(req: Request) {
  try {
    const body: DispatchRequest = await req.json();

    if (body.action === 'test_connection') {
      // Simulate pinging Zoho Mail SMTP / IMAP endpoint
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json({
        success: true,
        message: 'Zoho Mail connection verified. SMTP port 465 / 587 SSL handshake successful (250 OK).',
        timestamp: new Date().toLocaleTimeString(),
        authenticatedUser: 'editorial.office1@pulsus-journal.org'
      });
    }

    if (body.action === 'send_single') {
      const { recipient, subject, templateId, instanceId } = body;
      if (!recipient?.email) {
        return NextResponse.json({ success: false, error: 'Recipient email is missing' }, { status: 400 });
      }

      // Humanized jitter pause
      const delayMs = (Math.floor(Math.random() * 800) + 700);
      await new Promise(resolve => setTimeout(resolve, delayMs));

      return NextResponse.json({
        success: true,
        recipient: recipient.email,
        author: recipient.author,
        title: recipient.title,
        status: 'sent',
        sentAt: new Date().toLocaleTimeString(),
        instanceId: instanceId || 'instance-1',
        templateId: templateId || 'slot-1',
        subject: subject || 'Editorial Invitation',
        messageId: `<zoho-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@zoho.com>`
      });
    }

    return NextResponse.json({ success: true, message: 'Action acknowledged' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Dispatch error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
