// check.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBFynS9-iYS7GxTeCzq-QPi9HRJr4qIRzY",
  authDomain: "ptech-warranty-website.firebaseapp.com",
  projectId: "ptech-warranty-website",
  storageBucket: "ptech-warranty-website.appspot.com",
  messagingSenderId: "335295749830",
  appId: "1:335295749830:web:2ba5d66219eb6f04d6c1c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const form = document.getElementById("warrantyCheckForm");
const resultDiv = document.getElementById("warrantyResult");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  resultDiv.classList.remove("show");

  // Show spinner
  resultDiv.innerHTML = `
    <div style="text-align:center; padding:20px;">
      <div class="spinner-border text-danger" role="status"></div>
      <p style="margin-top:10px; font-weight:bold;">Checking your warranty...</p>
    </div>
  `;
  resultDiv.classList.add("show");

  // Get input values and sanitize
  const serial = form.serialNumber.value.trim();
  const id = form.idNumber.value.trim();

  if (!serial && !id) {
    resultDiv.innerHTML = `
      <div style="color:red; font-weight:bold; padding:15px;">❌ Please enter Serial Number or Student ID.</div>
    `;
    return;
  }

  try {
    const ref = collection(db, "warranty_claims");
    let snap;
    let searchType = "";

    // Search by serial number if provided
    if (serial) {
      searchType = "serial";
      const q = query(ref, where("serial", "==", serial));
      snap = await getDocs(q);
    }

    // If no results from serial search and ID is provided, search by ID
    if ((!snap || snap.empty) && id) {
      searchType = "studentId";
      const q = query(ref, where("studentId", "==", id));
      snap = await getDocs(q);
    }

    if (!snap || snap.empty) {
      resultDiv.innerHTML = `
        <div style="color:red; padding:15px; border:1px solid #ffcccc; background:#fff0f0; border-radius:6px;">
          ❌ No matching warranty record found using ${searchType === "serial" ? "serial number" : "student ID"}.
        </div>
      `;
      return;
    }

    // Show result
    snap.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.timestamp?.toDate 
        ? data.timestamp.toDate().toLocaleString() 
        : data.timestamp?.seconds 
          ? new Date(data.timestamp.seconds * 1000).toLocaleString()
          : "N/A";

      resultDiv.innerHTML = `
        <div style="border:1px solid #ccc; padding:20px; border-radius:8px; background:#fff;">
          <h3 style="color:green;">✅ Warranty Found</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Device Model:</strong> ${data.model}</p>
          <p><strong>Serial Number:</strong> ${data.serial}</p>
          <p><strong>Student:</strong> ${data.isStudent ? "Yes" : "No"}</p>
          ${data.studentId ? `<p><strong>Student ID:</strong> ${data.studentId}</p>` : ""}
          <p><strong>Problem:</strong> ${data.problem}</p>
          <p><strong>Registered On:</strong> ${createdAt}</p>
          <p style="margin-top:10px; color:green;"><strong>Status:</strong> Your warranty is valid and under review or service.</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error checking warranty:", error);
    resultDiv.innerHTML = `
      <div style="color:red; padding:15px; border:1px solid #ffcccc; background:#fff0f0; border-radius:6px;">
        ❌ Error searching warranty: ${error.message}
      </div>
    `;
  }
});