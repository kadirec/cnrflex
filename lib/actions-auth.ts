"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUser || !expectedHash) {
    return { error: "Sunucu yapılandırması eksik" };
  }
  if (username !== expectedUser) {
    return { error: "Kullanıcı adı veya şifre hatalı" };
  }
  const ok = bcrypt.compareSync(password, expectedHash);
  if (!ok) return { error: "Kullanıcı adı veya şifre hatalı" };

  const session = await getSession();
  session.userId = expectedUser;
  await session.save();
  redirect("/panel");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
