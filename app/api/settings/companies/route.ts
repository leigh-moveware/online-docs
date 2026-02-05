import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all companies with their hero and copy data
export async function GET() {
  try {
    const brandings = await prisma.branding.findMany({
      orderBy: { companyName: 'asc' },
    });

    // Fetch hero and copy data for each company
    const companiesWithAllData = await Promise.all(
      brandings.map(async (branding) => {
        const hero = await prisma.hero.findUnique({
          where: { companyId: branding.companyId },
        });

        const copy = await prisma.copy.findUnique({
          where: { companyId: branding.companyId },
        });

        return {
          ...branding,
          heroHeading: hero?.heading,
          heroSubheading: hero?.subheading,
          heroCtaText: hero?.ctaText,
          heroCtaUrl: hero?.ctaUrl,
          heroImageUrl: hero?.imageUrl,
          tagline: copy?.tagline,
          description: copy?.description,
          metaDescription: copy?.metaDescription,
        };
      })
    );

    return NextResponse.json(companiesWithAllData);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST create or update company (saves to Branding, Hero, and Copy tables)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      id,
      companyId,
      brandCode,
      companyName,
      logoUrl,
      primaryColor,
      secondaryColor,
      tertiaryColor,
      fontFamily,
      heroHeading,
      heroSubheading,
      heroCtaText,
      heroCtaUrl,
      heroImageUrl,
      tagline,
      description,
      metaDescription,
    } = body;

    // Validate required fields
    if (!companyId || !brandCode || !companyName) {
      return NextResponse.json(
        { error: 'Company ID, brand code, and company name are required' },
        { status: 400 }
      );
    }

    let branding;

    if (id) {
      // Update existing company branding
      branding = await prisma.branding.update({
        where: { id },
        data: {
          companyId,
          brandCode,
          companyName,
          logoUrl: logoUrl || null,
          primaryColor,
          secondaryColor,
          tertiaryColor: tertiaryColor || null,
          fontFamily,
        },
      });
    } else {
      // Create new company branding
      branding = await prisma.branding.create({
        data: {
          companyId,
          brandCode,
          companyName,
          logoUrl: logoUrl || null,
          primaryColor,
          secondaryColor,
          tertiaryColor: tertiaryColor || null,
          fontFamily,
        },
      });
    }

    // Upsert Hero data
    await prisma.hero.upsert({
      where: { companyId },
      update: {
        heading: heroHeading || null,
        subheading: heroSubheading || null,
        ctaText: heroCtaText || null,
        ctaUrl: heroCtaUrl || null,
        imageUrl: heroImageUrl || null,
      },
      create: {
        companyId,
        heading: heroHeading || null,
        subheading: heroSubheading || null,
        ctaText: heroCtaText || null,
        ctaUrl: heroCtaUrl || null,
        imageUrl: heroImageUrl || null,
      },
    });

    // Upsert Copy data
    await prisma.copy.upsert({
      where: { companyId },
      update: {
        tagline: tagline || null,
        description: description || null,
        metaDescription: metaDescription || null,
      },
      create: {
        companyId,
        tagline: tagline || null,
        description: description || null,
        metaDescription: metaDescription || null,
      },
    });

    return NextResponse.json(branding);
  } catch (error) {
    console.error('Error saving company:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save company',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
