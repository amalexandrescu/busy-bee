import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "./firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to handle user signup
export const signUp = async (name: string, email: string, password: string) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredentials.user;
    console.log("User created:", user);

    // After creating the user, save additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email: user.email,
      createdAt: new Date(), // Optionally add a timestamp
    });
  } catch (error) {
    console.error("Error signing up:", error);
    throw new Error("Sign up failed");
  }
};

// Function to handle user login
export const signIn = async (email: string, password: string) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredentials.user;
    console.log("User logged in:", user);
    console.log("User is still in Firebase Authentication:", user);
    return user;
  } catch (error: unknown) {
    console.error("Error signing in:", error);
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "auth/user-not-found"
    ) {
      console.log("User is not in Firebase Authentication");
    }
    throw new Error("Invalid credentials.");
  }
};
