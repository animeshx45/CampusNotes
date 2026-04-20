'use client';

import { 
  collection, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  increment,
  Firestore
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const MATERIALS_COLLECTION = 'studyMaterials';
const USERS_COLLECTION = 'users';

/**
 * Service for interacting with Study Materials in Firestore.
 * Refactored to follow non-blocking patterns.
 */
class MaterialService {
  private db: Firestore;

  constructor() {
    const { firestore } = initializeFirebase();
    this.db = firestore;
  }

  /**
   * Initiates a material upload.
   * @param material The material data to upload.
   */
  uploadMaterial(material: any) {
    return addDocumentNonBlocking(collection(this.db, MATERIALS_COLLECTION), {
      ...material,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      downloadCount: 0,
      views: 0
    });
  }

  /**
   * Initiates an increment for the download count.
   * @param id The material ID.
   */
  incrementDownloadCount(id: string) {
    const docRef = doc(this.db, MATERIALS_COLLECTION, id);
    updateDocumentNonBlocking(docRef, {
      downloadCount: increment(1)
    });
  }

  /**
   * Initiates a view count increment.
   * @param id The material ID.
   */
  incrementViewCount(id: string) {
    const docRef = doc(this.db, MATERIALS_COLLECTION, id);
    updateDocumentNonBlocking(docRef, {
      views: increment(1)
    });
  }
}

export const materialService = new MaterialService();
