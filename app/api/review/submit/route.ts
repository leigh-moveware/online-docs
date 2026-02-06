import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, token, brand, coId, answers } = body;

    // Validate required fields
    if (!jobId || !token || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: jobId, token, and answers' },
        { status: 400 }
      );
    }

    // TODO: Save to database once ReviewSubmission model is added to Prisma schema
    // For now, just log the submission and return success
    console.log('Performance review submitted:', {
      jobId,
      token,
      brand,
      coId,
      answersCount: Object.keys(answers).length,
      timestamp: new Date().toISOString(),
    });

    // Generate a mock submission ID
    const submissionId = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      submissionId,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
