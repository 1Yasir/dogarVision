import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// 1. Local key file load karein
const serviceAccount = JSON.parse(
  readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function addImageUrls() {
  const productsRef = db.collection('products');
  const snapshot = await productsRef.get();

  if (snapshot.empty) {
    console.log('❌ No products found in Firestore!');
    return;
  }  

  const batch = db.batch();

  snapshot.docs.forEach(doc => {
    const docId = doc.id; // Jaise 'chicken', 'achar', 'milk'
    const docRef = productsRef.doc(docId);
    
    // Har product ke liye automatic path generate karega
    const imageUrlPath = `/images/products/${docId}.png`;

    console.log(`Mapping found: ${docId} => ${imageUrlPath}`);
    batch.update(docRef, { imageUrl: imageUrlPath });
  });

  // Saare documents ko ek click me update karein
  await batch.commit();
  console.log('✨ Success! All products updated with imageUrl fields in Firestore.');
}

addImageUrls().catch(console.error);