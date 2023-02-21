const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  where,
  query,
} = require('firebase/firestore/lite');

// =========== CODE TO STORE THE USER ACCESS IN FIREBASE ========== //

const firebaseConfig = {
  apiKey: 'AIzaSyDE1zLu7JmEEM-0_FVVYuyeeeqkrfPImOY',
  authDomain: 'sms-automation-632a1.firebaseapp.com',
  projectId: 'sms-automation-632a1',
  storageBucket: 'sms-automation-632a1.appspot.com',
  messagingSenderId: '348757656980',
  appId: '1:348757656980:web:20ca8b662267532d05fb81',
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// Store refreshToken
exports.persistToken = async (token) => {
  try {
    let isExist = false;
    const q = query(collection(db, 'users'), where('token', '==', token));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.exists(token)) {
        const obj = doc.data();
        isExist = true;
      }
    });

    if (isExist) {
      return;
    }

    await setDoc(doc(db, 'users', 'tokens'), {
      token,
    });
  } catch (e) {
    console.log(e);
  }
};

// Fetch Refresh Token if exist in FireStore
exports.getTokenIfExist = async () => {
  let refreshToken;
  const docRef = doc(db, 'users', 'tokens');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const obj = docSnap.data();
    refreshToken = obj.token;
  } else {
    console.log('No such document!');
  }

  return refreshToken;
};
