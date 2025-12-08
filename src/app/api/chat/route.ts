export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const webhookUrl = payload.webhookUrl;
    if (!webhookUrl) {
      return Response.json(
        { error: 'Webhook URL not configured. Please set it in settings.' },
        { status: 400 }
      );
    }

    // Prepare webhook payload with RAG context if available
    const webhookPayload = {
      ...payload,
      // Include RAG context in a structured format for the webhook
      ragContext: payload.ragContext || null,
      projectId: payload.projectId && payload.projectId !== 'none' ? payload.projectId : null,
      // Format RAG context for easy consumption by AI workflows
      context: payload.ragContext
        ? {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sources: payload.ragContext.map((ctx: any) => ({
              document: ctx.document_name,
              project: ctx.project_name,
              content: ctx.content,
              similarity: ctx.similarity,
              metadata: ctx.metadata,
            })),
            summary: `Found ${payload.ragContext.length} relevant document chunks from project "${payload.ragContext[0]?.project_name || 'Unknown'}"`,
          }
        : null,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
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
