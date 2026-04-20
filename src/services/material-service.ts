import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp,
  increment,
  updateDoc,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StudyMaterial } from '@/lib/types';

// Matching collection name in backend.json
const MATERIALS_COLLECTION = 'studyMaterials';
const USERS_COLLECTION = 'users';

export const materialService = {
  async getAllMaterials() {
    try {
      const q = query(collection(db, MATERIALS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Handle both potential timestamp formats
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split('T')[0] : (data.createdAt || new Date().toISOString().split('T')[0])
        };
      }) as StudyMaterial[];
    } catch (error) {
      console.error("Error fetching materials:", error);
      return [];
    }
  },

  async getMaterialById(id: string) {
    try {
      const docRef = doc(db, MATERIALS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split('T')[0] : (data.createdAt || new Date().toISOString().split('T')[0])
        } as StudyMaterial;
      }
      return null;
    } catch (error) {
      console.error("Error fetching material by ID:", error);
      return null;
    }
  },

  async uploadMaterial(material: Omit<StudyMaterial, 'id' | 'createdAt' | 'downloadCount'>) {
    const docRef = await addDoc(collection(db, MATERIALS_COLLECTION), {
      ...material,
      createdAt: Timestamp.now(),
      downloadCount: 0
    });
    return docRef.id;
  },

  async incrementDownloadCount(id: string) {
    const docRef = doc(db, MATERIALS_COLLECTION, id);
    await updateDoc(docRef, {
      downloadCount: increment(1)
    });
  },

  async getStats() {
    try {
      const materialsCount = await getCountFromServer(collection(db, MATERIALS_COLLECTION));
      const usersCount = await getCountFromServer(collection(db, USERS_COLLECTION));
      return {
        resources: materialsCount.data().count,
        students: usersCount.data().count
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return { resources: 0, students: 0 };
    }
  }
};
