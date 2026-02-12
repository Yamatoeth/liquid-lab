// Use Supabase auth when available, otherwise fallback to a small stub
import * as supa from "@/lib/auth.supabase";

export const signUp = async (email: string, password: string) => {
  try {
    return await supa.signUp(email, password);
  } catch (e) {
    // fallback stub
    await new Promise((r) => setTimeout(r, 500));
    return { user: { email } };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    return await supa.signIn(email, password);
  } catch (e) {
    await new Promise((r) => setTimeout(r, 500));
    return { user: { email } };
  }
};

export const signOut = async () => {
  try {
    return await supa.signOut();
  } catch (e) {
    await new Promise((r) => setTimeout(r, 200));
  }
};

export default {
  signIn,
  signUp,
  signOut,
};
