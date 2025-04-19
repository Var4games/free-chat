// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-R7d_kAt9f8QIJ7WRkFfRHMo0iWIu-4o",

  authDomain: "chat-app-62af0.firebaseapp.com",

  projectId: "chat-app-62af0",

  storageBucket: "chat-app-62af0.firebasestorage.app",

  messagingSenderId: "888474458928",

  appId: "1:888474458928:web:5d12378a49d72d07e546f5",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const listenForChats = (setChats) => {
  const chatsRef = collection(db, "chats");
  const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
    const chatList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const filteredChats = chatList.filter((chat) =>
      chat?.users.some((user) => user.email === auth.currentUser.email)
    );
    setChats(filteredChats);
  });
  return unsubscribe;
};
export const sendMessage = async (messageText, chatId, user1, user2) => {
  if (!user1 || !user2) {
    console.error("❌ Invalid user IDs:", user1, user2);
    return;
  }

  const chatRef = doc(db, "chats", chatId);

  try {
    const user1DocSnap = await getDoc(doc(db, "user", user1));
    const user2DocSnap = await getDoc(doc(db, "user", user2));

    if (!user1DocSnap.exists() || !user2DocSnap.exists()) {
      console.error("❌ User documents not found:", user1, user2, chatId);
      return;
    }

    const user1Data = user1DocSnap.data();
    const user2Data = user2DocSnap.data();

    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        users: [user1Data, user2Data],
        lastMessage: messageText,
        lastMessageTimestamp: serverTimestamp(),
      });
    } else {
      await updateDoc(chatRef, {
        lastMessage: messageText,
        lastMessageTimestamp: serverTimestamp(),
      });
    }

    const messageRef = collection(db, "chats", chatId, "messages");
    await addDoc(messageRef, {
      text: messageText,
      sender: auth.currentUser.email,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
};

export const listenForMessage = (chatId, setMessages) => {
  const chatRef = collection(db, "chats", chatId, "messages");
  onSnapshot(chatRef, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id, // 🔥 Add this
      ...doc.data(),
    }));
    setMessages(messages);
  });
};
// Edit message
export const editMessage = async (chatId, messageId, newText) => {
  const messageRef = doc(db, "chats", chatId, "messages", messageId);
  await updateDoc(messageRef, {
    text: newText,
    edited: true,
  });
};

// Delete message
export const deleteMessage = async (chatId, messageId) => {
  const messageRef = doc(db, "chats", chatId, "messages", messageId);
  await deleteDoc(messageRef);
};
export { auth, db };
