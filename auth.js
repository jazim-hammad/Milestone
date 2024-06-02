// auth.js

import { auth, db } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const signUp = async (email, password, firstName, lastName, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update the user profile with first name, last name, and username
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Store additional user information in Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      username,
      email,
    });

    alert("User signed up successfully!");
    console.log("Signed up user:", user);
  } catch (error) {
    console.error("Error signing up:", error);
    alert(error.message);
  }
};

const login = async (identifier, password) => {
  try {
    let userCredential;
    if (identifier.includes("@")) {
      // Login with email
      userCredential = await signInWithEmailAndPassword(
        auth,
        identifier,
        password
      );
    } else {
      // Login with username
      const q = query(
        collection(db, "users"),
        where("username", "==", identifier)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("No user found with this username");
      }
      const userDoc = querySnapshot.docs[0];
      const email = userDoc.data().email;
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    }

    const user = userCredential.user;
    alert("User logged in successfully!");
    console.log("Logged in user:", user);
    window.location.href = "index.html"; // Redirect to index page
  } catch (error) {
    console.error("Error logging in:", error);
    alert(error.message);
  }
};

// Event listeners for form submission
document.querySelector(".signup form").addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = e.target.firstName.value;
  const lastName = e.target.lastName.value;
  const username = e.target.username.value;
  const email = e.target.email.value;
  const password = e.target.pswd.value;
  signUp(email, password, firstName, lastName, username);
});

document.querySelector(".login form").addEventListener("submit", (e) => {
  e.preventDefault();
  const identifier = e.target.identifier.value;
  const password = e.target.pswd.value;
  login(identifier, password);
});
