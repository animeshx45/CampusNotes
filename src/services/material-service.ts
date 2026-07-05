
'use client';

import { 
  collection, 
  doc, 
  serverTimestamp,
  increment,
  Firestore
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const MATERIALS_COLLECTION = 'studyMaterials';

/**
 * Service for interacting with Study Materials in Firestore.
 */
class MaterialService {
  private db: Firestore;

  constructor() {
    const { firestore } = initializeFirebase();
    this.db = firestore;
  }

  /**
   * Checks if an ID belongs to a mock data item.
   * Mock IDs typically start with branch prefixes (it-, cse-) or yt-.
   */
  private isMockId(id: string) {
    return (
      id.startsWith('it-') || 
      id.startsWith('cse-') || 
      id.startsWith('yt-') || 
      id.includes('s3-') || 
      id.includes('s4-') || 
      id.includes('s5-') || 
      id.includes('s6-') || 
      id.includes('s7-') || 
      id.includes('s8-')
    );
  }

  /**
   * Initiates a material upload.
   */
  async uploadMaterial(material: any) {
    return addDocumentNonBlocking(collection(this.db, MATERIALS_COLLECTION), {
      ...material,
      downloadCount: 0,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Initiates an increment for the download count.
   * Skips mock data IDs as they don't exist in Firestore.
   */
  incrementDownloadCount(id: string) {
    if (this.isMockId(id)) return;
    const docRef = doc(this.db, MATERIALS_COLLECTION, id);
    updateDocumentNonBlocking(docRef, {
      downloadCount: increment(1)
    });
  }

  /**
   * Initiates a view count increment.
   * Skips mock data IDs as they don't exist in Firestore.
   */
  incrementViewCount(id: string) {
    if (this.isMockId(id)) return;
    const docRef = doc(this.db, MATERIALS_COLLECTION, id);
    updateDocumentNonBlocking(docRef, {
      views: increment(1)
    });
  }
}

export const materialService = new MaterialService();
