import { NextResponse } from 'next/server';
import { prisma } from '@/lib/cockroachdb';

export async function GET() {
  try {
    // 1. Fetch placement materials
    let materials = await prisma.studyMaterial.findMany({
      where: { branch: 'Placement Materials' },
      orderBy: { createdAt: 'desc' },
    });

    // 2. If 0 found, let's seed mock placement folders
    if (materials.length === 0) {
      console.log('No placement materials found in database. Seeding initial placement folders...');
      
      const seedMaterials = [
        {
          title: 'Aptitude & Quantitative Reasoning Guide',
          subject: 'Quantitative Aptitude',
          description: 'Comprehensive formulas sheet, shortcut methods for logical and numerical questions, and past assessment sample papers.',
          branch: 'Placement Materials',
          semester: 1,
          type: 'Folder',
          fileUrl: 'folder',
          author: 'Training & Placement Cell',
          uploaderId: 'system',
          downloadCount: 145,
          views: 312,
          status: 'approved',
          folderFiles: [
            {
              name: 'Quantitative Aptitude Formulas.pdf',
              fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf',
              type: 'pdf'
            },
            {
              name: 'Logical Reasoning Shortcuts.pdf',
              fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf',
              type: 'pdf'
            },
            {
              name: 'Data Interpretation Practice.pdf',
              fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf',
              type: 'pdf'
            }
          ]
        },
        {
          title: 'Coding Interview Prep (DSA)',
          subject: 'Data Structures & Algorithms',
          description: 'Topic-wise coding problems sheets, algorithmic cheatsheets for DP & Graphs, and standard interview coding questions.',
          branch: 'Placement Materials',
          semester: 1,
          type: 'Folder',
          fileUrl: 'folder',
          author: 'Senior Coding Club',
          uploaderId: 'system',
          downloadCount: 289,
          views: 540,
          status: 'approved',
          folderFiles: [
            {
              name: 'DSA cheatsheet.pdf',
              fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf',
              type: 'pdf'
            },
            {
              name: 'LeetCode Pattern-wise Problems.pdf',
              fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf',
              type: 'pdf'
            },
            {
              name: 'System Design Basics.pdf',
              fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf',
              type: 'pdf'
            }
          ]
        },
        {
          title: 'Resume Templates & HR Prep Guide',
          subject: 'Interview Prep',
          description: 'ATS-friendly resume templates (LaTeX/Word format), behavioral interview questions (STAR method), and HR prep checklist.',
          branch: 'Placement Materials',
          semester: 1,
          type: 'Folder',
          fileUrl: 'folder',
          author: 'T&P Senior Mentors',
          uploaderId: 'system',
          downloadCount: 198,
          views: 420,
          status: 'approved',
          folderFiles: [
            {
              name: 'ATS Resume LaTeX Template.pdf',
              fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf',
              type: 'pdf'
            },
            {
              name: 'Behavioral Questions & Tips.pdf',
              fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pgh.pdf',
              type: 'pdf'
            }
          ]
        }
      ];

      for (const mat of seedMaterials) {
        await prisma.studyMaterial.create({
          data: mat as any
        });
      }

      // Re-fetch seeded materials
      materials = await prisma.studyMaterial.findMany({
        where: { branch: 'Placement Materials' },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ count: materials.length, data: materials });
  } catch (error: any) {
    console.error('Failed to query/seed placement materials:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
