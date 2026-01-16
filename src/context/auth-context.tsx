"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import type { UserRole, UserProfile } from "@/types/admin";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInAsAdmin: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (
    data: Partial<
      Omit<UserProfile, "uid" | "email" | "role" | "createdAt" | "updatedAt">
    >
  ) => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Helper function to get or create user profile
const getOrCreateUserProfile = async (
  user: User,
  role: UserRole = "user"
): Promise<UserProfile> => {
  const userRef = doc(db, "users", user.uid);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

      // Update the profile if Firebase Auth data has changed
      const updates: Record<string, unknown> = {};
      if (user.email && user.email !== data.email) {
        updates.email = user.email;
      }
      if (user.displayName && user.displayName !== data.displayName) {
        updates.displayName = user.displayName;
      }
      if (user.photoURL && user.photoURL !== data.photoURL) {
        updates.photoURL = user.photoURL;
      }

      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        updates.updatedAt = serverTimestamp();
        await updateDoc(userRef, updates);
      }

      return {
        uid: user.uid,
        email: (updates.email as string) || data.email || user.email || "",
        displayName:
          (updates.displayName as string) ||
          data.displayName ||
          user.displayName ||
          "",
        photoURL:
          (updates.photoURL as string) || data.photoURL || user.photoURL,
        role: data.role || "user",
        bio: data.bio,
        experienceLevel: data.experienceLevel,
        riskTolerance: data.riskTolerance,
        investmentGoal: data.investmentGoal,
        preferredSectors: data.preferredSectors,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }

    // Create new user profile on first login
    // Note: Don't include undefined values - Firestore doesn't handle them well
    const newProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || null,
      role: role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log("Creating new user profile in Firestore:", newProfile);
    await setDoc(userRef, newProfile);
    console.log("User profile created successfully");

    return {
      uid: newProfile.uid,
      email: newProfile.email,
      displayName: newProfile.displayName,
      photoURL: newProfile.photoURL,
      role: newProfile.role,
      bio: undefined,
      experienceLevel: undefined,
      riskTolerance: undefined,
      investmentGoal: undefined,
      preferredSectors: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error in getOrCreateUserProfile:", error);
    throw error;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const profile = await getOrCreateUserProfile(user);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      const result = await signInWithPopup(auth, provider);
      await getOrCreateUserProfile(result.user, "user");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await getOrCreateUserProfile(result.user);
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  };

  // Admin sign-in: Only allows login if the user already exists in Firestore with admin role
  const signInAsAdmin = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Check if user exists in Firestore
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // User doesn't exist in Firestore - sign them out and throw error
        await firebaseSignOut(auth);
        throw new Error(
          "Admin account not found. Please contact the administrator."
        );
      }

      const userData = userSnap.data();
      if (userData.role !== "admin" && userData.role !== "super_admin") {
        // User exists but isn't an admin - sign them out and throw error
        await firebaseSignOut(auth);
        throw new Error(
          "Access denied. This account does not have admin privileges."
        );
      }

      // Valid admin - update profile if needed
      await getOrCreateUserProfile(result.user);
    } catch (error) {
      console.error("Error signing in as admin:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name
      await updateProfile(result.user, { displayName });

      // Create user profile with 'user' role (admins are set manually in Firestore)
      await getOrCreateUserProfile(result.user, "user");
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const updateUserProfile = async (
    data: Partial<
      Omit<UserProfile, "uid" | "email" | "role" | "createdAt" | "updatedAt">
    >
  ) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    try {
      const userRef = doc(db, "users", user.uid);

      // Update Firestore with all provided fields
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      // Update Firebase Auth profile if display name or photo changed
      if (data.displayName || data.photoURL) {
        await updateProfile(user, {
          displayName: data.displayName || user.displayName,
          photoURL: data.photoURL || user.photoURL,
        });
      }

      // Update local state with all the new data
      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              ...data,
              updatedAt: new Date(),
            }
          : null
      );
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const isAdmin =
    userProfile?.role === "admin" || userProfile?.role === "super_admin";
  const isSuperAdmin = userProfile?.role === "super_admin";

  const value = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signInAsAdmin,
    signUpWithEmail,
    resetPassword,
    signOut,
    updateUserProfile,
    isAdmin,
    isSuperAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
