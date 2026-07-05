'use client';

import { 
  collection, 
  doc, 
  serverTimestamp,
  increment,
  Firestore
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

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
   */
  private isMockId(id: string) {
    return (
      id.startsWith('it-') || 
      id.startsWith('cse-') || 
      id.startsWith('chem-') ||
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
   * Updates an existing material (Admin/Owner action).
   */
  updateMaterial(id: string, data: any) {
    if (this.isMockId(id)) return;
    const docRef = doc(this.db, MATERIALS_COLLECTION, id);
    updateDocumentNonBlocking(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Deletes a material (Admin/Owner action).
   */
  deleteMaterial(id: string) {
    if (this.isMockId(id)) return;
    const docRef = doc(this.db, MATERIALS_COLLECTION, id);
    deleteDocumentNonBlocking(docRef);
  }

  /**
   * Increments download count.
   */
  incrementDownloadCount(id: string) {
    if (this.isMockId(id)) return;
    const docRef = doc(this.db, MATERIALS_COLLECTION, id);
    updateDocumentNonBlocking(docRef, {
      downloadCount: increment(1)
    });
  }

  /**
   * Increments view count.
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
