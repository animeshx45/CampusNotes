import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  increment,
  updateDoc,
  getCountFromServer,
  Firestore
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { StudyMaterial } from '@/lib/types';

// Matching collection names in backend.json
const MATERIALS_COLLECTION = 'studyMaterials';
const USERS_COLLECTION = 'users';

/**
 * Service for interacting with Study Materials in Firestore.
 */
class MaterialService {
  private db: Firestore;

  constructor() {
    const { firestore } = initializeFirebase();
    this.db = firestore;
  }

  async getAllMaterials() {
    try {
      const q = query(collection(this.db, MATERIALS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate 
            ? data.createdAt.toDate().toLocaleDateString() 
            : new Date().toLocaleDateString()
        };
      }) as StudyMaterial[];
    } catch (error) {
      console.error("Error fetching materials:", error);
      return [];
    }
  }

  async getMaterialById(id: string) {
    try {
      const docRef = doc(this.db, MATERIALS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate 
            ? data.createdAt.toDate().toLocaleDateString() 
            : new Date().toLocaleDateString()
        } as StudyMaterial;
      }
      return null;
    } catch (error) {
      console.error("Error fetching material by ID:", error);
      return null;
    }
  }

  async uploadMaterial(material: any) {
    // Note: uploaderId must match request.auth.uid per security rules
    const docRef = await addDoc(collection(this.db, MATERIALS_COLLECTION), {
      ...material,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      downloadCount: 0,
      views: 0
    });
    return docRef.id;
  }

  async incrementDownloadCount(id: string) {
    const docRef = doc(this.db, MATERIALS_COLLECTION, id);
    await updateDoc(docRef, {
      downloadCount: increment(1)
    });
  }

  async getStats() {
    try {
      const materialsCount = await getCountFromServer(collection(this.db, MATERIALS_COLLECTION));
      const usersCount = await getCountFromServer(collection(this.db, USERS_COLLECTION));
      return {
        resources: materialsCount.data().count,
        students: usersCount.data().count
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return { resources: 0, students: 0 };
    }
  }
}

export const materialService = new MaterialService();
