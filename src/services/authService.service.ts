export async function authLogin(email: string, password: string) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "Erreur d'authentification" };
    }
    return data;
  } catch (error: any) {
    return { error: error.message || "Erreur réseau" };
  }
}
