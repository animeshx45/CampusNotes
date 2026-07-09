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

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!response.ok) {
      console.error(`[PDF Proxy Error] Failed to fetch PDF from ${targetUrl}. Status: ${response.status} ${response.statusText}`);
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

export async function HEAD(request: NextRequest) {
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

    const response = await fetch(targetUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!response.ok) {
      return new NextResponse(`Failed to fetch HEAD: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/pdf';

    return new NextResponse(null, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error: any) {
    console.error('PDF Proxy HEAD error:', error);
    return new NextResponse(`Error proxying HEAD: ${error.message}`, { status: 500 });
  }
}
