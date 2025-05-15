// place files you want to import through the `$lib` alias in this folder.
import { createAuthClient } from "better-auth/svelte";
import { writable } from "svelte/store";
import type { Errors, LoginPayload, SignUpPayload, userData } from "./types";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000/api/auth/",
  fetchOptions: {
    credentials: "include",
  },
});

export const user = writable<userData | null>(null);
export const errors = writable<Errors | null>(null);
export const authLoading = writable(true);

export const initAuth = async () => {
  const session = authClient.useSession();

  session.subscribe(({ data, error }) => {
    if (data?.user) {
      user.set(data?.user as userData);
    } else {
      user.set(null);
    }

    if (error) {
      errors.set({
        message: error.message,
        status: error.status,
        statusText: error.statusText,
      });
    } else {
      errors.set(null);
    }

    authLoading.set(false);
  });
};

export const signup = async (data: SignUpPayload) => {
  const res = await authClient.signUp.email(data);

  if (res.error) {
    errors.set(res.error);
    user.set(null);
  } else {
    errors.set(null);
    user.set(res.data.user);
  }
};

export const login = async (data: LoginPayload) => {
  const res = await authClient.signIn.email(data);

  if (res.error) {
    errors.set(res.error);
    user.set(null);
  } else {
    errors.set(null);
    user.set(res.data.user);
  }
};

export const logout = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/";
      },
    },
  });
  user.set(null);
  errors.set(null);
};

export const deleteAccount = async () => {
  const res = await fetch("http://localhost:3000/api/user/me", {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();

  if (!res.ok) {
    errors.set({
      message: data.error,
      status: res.status,
      statusText: res.statusText,
    });
  } else {
    user.set(null);
    window.location.href = "/";
  }
};
