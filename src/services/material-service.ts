
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
 * Refactored to follow non-blocking patterns and handle mock IDs gracefully.
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
   * Only attempts if the ID does not start with 'yt-' (curated playlists).
   * @param id The material ID.
   */
  incrementDownloadCount(id: string) {
    if (id.startsWith('yt-')) return;
    const docRef = doc(this.db, MATERIALS_COLLECTION, id);
    updateDocumentNonBlocking(docRef, {
      downloadCount: increment(1)
    });
  }

  /**
   * Initiates a view count increment.
   * Only attempts if the ID does not start with 'yt-' (curated playlists).
   * @param id The material ID.
   */
  incrementViewCount(id: string) {
    if (id.startsWith('yt-')) return;
    const docRef = doc(this.db, MATERIALS_COLLECTION, id);
    updateDocumentNonBlocking(docRef, {
      views: increment(1)
    });
  }
}

export const materialService = new MaterialService();
