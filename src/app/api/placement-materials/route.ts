import { NextResponse } from 'next/server';
import { prisma } from '@/lib/cockroachdb';

export async function GET() {
  try {
    // 1. Fetch placement materials
    let materials = await prisma.studyMaterial.findMany({
      where: { branch: 'Placement Materials' },
      orderBy: { createdAt: 'desc' },
    });

    const hasEmptyCompanies = materials.length > 0 && materials.some(m => m.subject === 'ACCENTURE') && materials.every(m => !m.folderFiles || (Array.isArray(m.folderFiles) && m.folderFiles.length === 0));

    // 2. If 0 or old mock data found, let's clear and seed empty company placement folders
    if (materials.length === 0 || !hasEmptyCompanies) {
      console.log('Empty company-specific placement materials not found. Clearing old and seeding...');
      
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
        downloadCount: 0,
        views: 0,
        status: 'approved',
        folderFiles: []
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
