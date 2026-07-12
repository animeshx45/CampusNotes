import { NextResponse } from 'next/server';
import { prisma } from '@/lib/cockroachdb';

export async function GET() {
  try {
    // 1. Fetch placement materials
    let materials = await prisma.studyMaterial.findMany({
      where: { branch: 'Placement Materials' },
      orderBy: { createdAt: 'desc' },
    });

    const hasCompanies = materials.some(m => m.subject === 'ACCENTURE');

    // 2. If 0 or old mock data found, let's clear and seed company placement folders
    if (materials.length === 0 || !hasCompanies) {
      console.log('Company-specific placement materials not found. Clearing old and seeding...');
      
      await prisma.studyMaterial.deleteMany({
        where: { branch: 'Placement Materials' }
      });

      const companies = [
        'ACCENTURE',
        'CAPGEMINI',
        'Delloite',
        'IBM',
        'INFOSYS',
        'TCS',
        'WIPRO',
        'ZENPACT'
      ];

      const seedMaterials = companies.map(company => ({
        title: `${company} Placement Materials`,
        subject: company,
        description: `${company}-specific placement prep materials, including past papers, coding questions, and interview preparation resources.`,
        branch: 'Placement Materials',
        semester: 1,
        type: 'Folder',
        fileUrl: 'folder',
        author: 'Training & Placement Cell',
        uploaderId: 'system',
        downloadCount: Math.floor(Math.random() * 200) + 50,
        views: Math.floor(Math.random() * 400) + 100,
        status: 'approved',
        folderFiles: [
          {
            name: `${company} Prep Guide.pdf`,
            fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf',
            type: 'pdf'
          },
          {
            name: `${company} Past Interview Questions.pdf`,
            fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf',
            type: 'pdf'
          }
        ]
      }));

      for (const mat of seedMaterials) {
        await prisma.studyMaterial.create({
          data: mat as any
        });
      }

      // Re-fetch seeded materials
      materials = await prisma.studyMaterial.findMany({
        where: { branch: 'Placement Materials' },
        orderBy: { title: 'asc' }, // Sort by title so they show up alphabetically
      });
    }

    return NextResponse.json({ count: materials.length, data: materials });
  } catch (error: any) {
    console.error('Failed to query/seed placement materials:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
