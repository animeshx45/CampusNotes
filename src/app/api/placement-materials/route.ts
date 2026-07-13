import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import StudyMaterial from '@/lib/models/StudyMaterial';

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Fetch all placement materials
    let allMaterials = await StudyMaterial.find({ branch: 'Placement Materials' }).lean();

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

    // Check if company folders are seeded
    let folderDocs = allMaterials.filter((m: any) => m.type === 'Folder' && m.uploaderId === 'system');

    if (folderDocs.length === 0) {
      console.log('Seeding company placement folders...');
      const seedMaterials = companies.map(company => ({
        title: `${company} Placement Materials`,
        subject: company,
        description: `${company}-specific placement prep materials, including past papers, coding questions, and interview preparation resources.`,
        branch: 'Placement Materials',
        semester: 8,
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

      // Re-fetch everything
      allMaterials = await StudyMaterial.find({ branch: 'Placement Materials' }).lean();
      folderDocs = allMaterials.filter((m: any) => m.type === 'Folder' && m.uploaderId === 'system');
    }

    // Group individual files by company subject
    const companyStats: Record<string, { count: number; views: number; downloads: number; files: any[] }> = {};
    const upperCompanies = companies.map(c => c.toUpperCase());
    companies.forEach(c => {
      companyStats[c.toUpperCase()] = { count: 0, views: 0, downloads: 0, files: [] };
    });

    allMaterials.forEach((m: any) => {
      const subject = (m.subject || '').toUpperCase().trim();
      const matchedCompany = upperCompanies.find(c => subject.includes(c) || c.includes(subject));
      if (matchedCompany) {
        if (m.type === 'Folder' && m.uploaderId !== 'system') {
          companyStats[matchedCompany].views += (m.views || 0);
          companyStats[matchedCompany].downloads += (m.downloadCount || 0);
          if (m.folderFiles && Array.isArray(m.folderFiles)) {
            m.folderFiles.forEach((file: any) => {
              companyStats[matchedCompany].count += 1;
              companyStats[matchedCompany].files.push({
                name: file.name,
                fileUrl: file.fileUrl,
                type: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image')
              });
            });
          }
        } else if (m.type !== 'Folder') {
          companyStats[matchedCompany].count += 1;
          companyStats[matchedCompany].views += (m.views || 0);
          companyStats[matchedCompany].downloads += (m.downloadCount || 0);
          companyStats[matchedCompany].files.push({
            name: m.title,
            fileUrl: m.fileUrl,
            type: m.type === 'image' ? 'image' : 'pdf'
          });
        }
      }
    });

    // Construct the final list of company folders with dynamic files and counts
    const data = folderDocs.map((m: any) => {
      const subject = (m.subject || '').toUpperCase().trim();
      const stats = companyStats[subject] || { count: 0, views: 0, downloads: 0, files: [] };
      return {
        ...m,
        id: m._id.toString(),
        views: stats.views || m.views || 0,
        downloadCount: stats.downloads || m.downloadCount || 0,
        folderFiles: stats.files
      };
    });

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
      semester: 8,
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
