export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const webhookUrl = 'https://guidocroon.com/n8n/webhook/e5766a0b-e8ad-46ab-a284-34b9dbf2583c';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return Response.json(
        { error: `Webhook error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract the message from various possible response formats
    let message = '';
    if (data.output) {
      message = data.output;
    } else if (data.message) {
      message = data.message;
    } else if (data.response) {
      message = data.response;
    } else if (data.text) {
      message = data.text;
    } else if (typeof data === 'string') {
      message = data;
    } else {
      message = JSON.stringify(data);
    }

    return Response.json({ message });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}
