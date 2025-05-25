import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params.id is available
    if (!params?.id) {
      return NextResponse.json(
        { status: 'error', message: 'Listing ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`https://tool-nest-backend-8m7yzs9io-failalihaytams-projects.vercel.app/api/api/listings/${params.id}`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
} 