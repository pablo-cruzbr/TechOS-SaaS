import Image from "next/image";
import styles from '../../src/app/page.module.scss';
import logoImg from "../../public/Logo8.svg";
import { cookies } from "next/headers";
import { api } from "@/services/api";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

interface AuthResponse {
  token: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export default async function Home({ searchParams }: PageProps) {
  // Aguarda os parâmetros da URL
  const { error } = await searchParams;

  async function handleLogin(formData: FormData) {
    "use server";
    
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) return;

    let shouldRedirect = false;

    try {
      const response = await api.post("/session", { 
        email: email.toString(), 
        password: password.toString() 
      });

      // Validação de Admin
      if (response.data.isAdmin !== true) {
        redirect("/?error=no_admin");
      }

      // Se passou, cria o cookie
      const cookieStore = await cookies();
      cookieStore.set("session", response.data.token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
      });

      shouldRedirect = true;

    } catch (err: any) {
      // Importante: deixa o redirect do Next funcionar
      if (err.message === 'NEXT_REDIRECT') throw err;
      
      console.log("Erro login:", err.response?.data || err.message);
      redirect("/?error=credentials");
    }

    if (shouldRedirect) {
      redirect("/dashboard/ticketscount");
    }
  }

  // Define a mensagem de erro baseada no parâmetro da URL
  const errorMsg = error === "no_admin" 
    ? "Acesso negado: Somente administradores." 
    : error === "credentials" 
    ? "E-mail ou senha incorretos." 
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.conteiner}>
        <section className={styles.login}>
          <Image 
            src={logoImg} 
            alt="Logo SF2" 
            width={200} 
            height={100} 
            priority 
            className={styles.logo}
          />
          
          <h1>Login Admin</h1>

          {/* Exibe o erro se ele existir */}
          {errorMsg && (
            <p style={{ color: '#FF3F4B', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>
              {errorMsg}
            </p>
          )}

          <form action={handleLogin}>
            <input 
              type="email" 
              name="email" 
              placeholder="Digite seu email" 
              required 
              className={styles.input} 
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Digite sua senha" 
              required 
              className={styles.input} 
            />
            <button type="submit">Acessar</button>
          </form>
        </section>
      </div>
    </div>
  );
}