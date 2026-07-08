import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');

  if (!pdfUrl) {
    return new NextResponse('URL parameter is required', { status: 400 });
  }

  try {
    let targetUrl = pdfUrl;
    if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
      const origin = request.nextUrl.origin;
      targetUrl = `${origin}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/pdf';
    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (error: any) {
    console.error('PDF Proxy error:', error);
    return new NextResponse(`Error proxying PDF: ${error.message}`, { status: 500 });
  }
}
