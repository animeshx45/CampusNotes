import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import StudyMaterial from '@/lib/models/StudyMaterial';

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Fetch placement materials
    let materials = await StudyMaterial.find({ branch: 'Placement Materials' }).lean();

    const hasEmptyCompanies = materials.length > 0 && materials.some(m => m.subject === 'ACCENTURE') && materials.every(m => !m.folderFiles || (Array.isArray(m.folderFiles) && m.folderFiles.length === 0));

    // 2. If 0 or old mock data found, let's clear and seed empty company placement folders
    if (materials.length === 0 || !hasEmptyCompanies) {
      console.log('Empty company-specific placement materials not found. Clearing old and seeding in MongoDB...');
      
      await StudyMaterial.deleteMany({
        branch: 'Placement Materials'
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
        await StudyMaterial.create(mat);
      }

      // Re-fetch seeded materials
      materials = await StudyMaterial.find({ branch: 'Placement Materials' }).sort({ title: 'asc' }).lean();
    }

    const data = materials.map((m: any) => ({
      ...m,
      id: m._id.toString()
    }));

    return NextResponse.json({ count: data.length, data });
  } catch (error: any) {
    console.error('Failed to query/seed placement materials, returning fallback folders:', error);
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
    const fallbackData = companies.map(company => ({
      id: `fallback-${company.toLowerCase()}`,
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
    return NextResponse.json({ count: fallbackData.length, data: fallbackData });
  }
}
