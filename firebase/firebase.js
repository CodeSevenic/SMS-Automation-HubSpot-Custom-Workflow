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
  addDoc,
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

// Store user to database
exports.addUserToBD = async (
  { username, password },
  refresh_token,
  access_token,
  expires_in,
  userId
) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      username,
      password,
      refresh_token,
      access_token,
      expires_in,
      userId: userId || 'none',
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// if user exist return
exports.userExist = async () => {
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
};

// get users from DB
exports.getUserFromDB = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  let users = [];
  querySnapshot.forEach((doc) => {
    // console.log(`${doc.id} => ${doc.get('user.body.name')}`);
    const user = {
      username: doc.get('username'),
      password: doc.get('password'),
      refresh_token: doc.get('refresh_token'),
      access_token: doc.get('access_token'),
      expires_in: doc.get('expires_in'),
      userId: doc.get('userId'),
    };

    users.push(user);
  });

  console.log(users);
  return users;
};
