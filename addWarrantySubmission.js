// addWarrantySubmission.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFynS9-iYS7GxTeCzq-QPi9HRJr4qIRzY",
  authDomain: "ptech-warranty-website.firebaseapp.com",
  projectId: "ptech-warranty-website",
  storageBucket: "ptech-warranty-website.firebasestorage.app",
  messagingSenderId: "335295749830",
  appId: "1:335295749830:web:2ba5d66219eb6f04d6c1c7",
  measurementId: "G-NFKHFN19LZ"
};

// ✅ Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Sample warranty claim data
const newClaim = {
  fullName: "John Doe",
  email: "johndoe@example.com",
  phone: "0700000000",
  deviceModel: "Samsung Galaxy A12",
  serialNumber: "SGA12-4567890",
  isStudent: true,
  studentId: "STU123456",
  problemDescription: "Screen is cracked and battery drains fast",
  createdAt: new Date()
};

// ✅ Function to add to Firestore
async function submitWarrantyClaim() {
  try {
    const docRef = await addDoc(collection(db, "warranty_claims"), newClaim);
    console.log("✅ Claim submitted with ID:", docRef.id);
  } catch (e) {
    console.error("❌ Error adding claim:", e);
  }
}

submitWarrantyClaim();
