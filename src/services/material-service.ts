
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  increment,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StudyMaterial, Branch } from '@/lib/types';

const MATERIALS_COLLECTION = 'materials';

export const materialService = {
  async getAllMaterials() {
    const q = query(collection(db, MATERIALS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
    })) as StudyMaterial[];
  },

  async getMaterialById(id: string) {
    const docRef = doc(db, MATERIALS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
      } as StudyMaterial;
    }
    return null;
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
  }
};
