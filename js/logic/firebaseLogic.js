// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOnIBajCqzxOASHoorvGHMjrKAYmv4AtA",
  authDomain: "studio-4583592848-e1404.firebaseapp.com",
  projectId: "studio-4583592848-e1404",
  storageBucket: "studio-4583592848-e1404.firebasestorage.app",
  messagingSenderId: "73546578465",
  appId: "1:73546578465:web:f095ec72bef86ac6cb8160"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Saves a study to the "angioTAC" collection in Firestore.
 * @param {object} studyData - The data of the study to save.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function saveStudy(studyData) {
  try {
    const docRef = await addDoc(collection(db, "angioTAC"), studyData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

/**
 * Retrieves a user's data from the "users" collection.
 * @param {string} userId - The UID of the user.
 * @returns {Promise<object|null>} The user data or null if not found.
 */
export async function getUserData(userId) {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No user data found for UID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}

/**
 * Updates a user's data in the "users" collection.
 * @param {string} userId - The UID of the user to update.
 * @param {object} userData - The new data for the user.
 * @returns {Promise<void>}
 */
export async function updateUserData(userId, userData) {
  try {
    const docRef = doc(db, "users", userId);
    // Usar setDoc con merge:true es la forma correcta de crear el documento si no existe,
    // o actualizarlo si ya existe, sin sobrescribir los campos no incluidos.
    await setDoc(docRef, userData, { merge: true });
    console.log("User data created/updated for UID: ", userId);
  } catch (error) {
    console.error("Error updating user data: ", error);
    throw error;
  }
}

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param {File} file - The file to upload.
 * @param {string} path - The path in storage where the file should be saved (e.g., `profileImages/${userId}`).
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export async function uploadFile(file, path) {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File uploaded successfully. URL:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

/**
 * Retrieves all users' data from the "users" collection.
 * @returns {Promise<Array<object>>} An array of user objects, each with a uid.
 */
export async function getAllUsers() {
  try {
    const usersCollectionRef = collection(db, "users");
    // You might want to add a query here if you need to filter or order users
    const q = query(usersCollectionRef); 
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
}

/**
 * Retrieves all studies from the "angioTAC" collection in Firestore.
 * @returns {Promise<Array<object>>} An array of study objects, each with an id.
 */
export async function getStudies() {
  try {
    const querySnapshot = await getDocs(collection(db, "angioTAC"));
    const studies = [];
    querySnapshot.forEach((doc) => {
      studies.push({ id: doc.id, ...doc.data() });
    });
    return studies;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
}

/**
 * Retrieves a single study from the "angioTAC" collection in Firestore.
 * @param {string} studyId - The ID of the study to retrieve.
 * @returns {Promise<object|null>} The study data or null if not found.
 */
export async function getStudy(studyId) {
  try {
    const docRef = doc(db, "angioTAC", studyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    throw e;
  }
}

/**
 * Updates a study in the "angioTAC" collection in Firestore.
 * @param {string} studyId - The ID of the study to update.
 * @param {object} studyData - The new data for the study.
 * @returns {Promise<void>}
 */
export async function updateStudy(studyId, studyData) {
  try {
    const docRef = doc(db, "angioTAC", studyId);
    await updateDoc(docRef, studyData);
    console.log("Document updated with ID: ", studyId);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
}

/**
 * Deletes a study from the "angioTAC" collection in Firestore.
 * @param {string} studyId - The ID of the study to delete.
 * @returns {Promise<void>}
 */
export async function deleteStudy(studyId) {
  try {
    const docRef = doc(db, "angioTAC", studyId);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", studyId);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
}