import Image from "next/image";
import styles from '../../src/app/page.module.scss';
import logoImg from "../../public/logo3.svg";
import Link from "next/link";
import { cookies } from "next/headers";
import { api } from "@/services/api";
import { redirect } from "next/navigation";

export default function Home() {
  // Função de login
 async function handleLogin(formData: FormData) {
     "use server";
 
     const email = formData.get("email");
     const password = formData.get("password");
 
     if (!email || !password || email.toString().trim() === "" || password.toString().trim() === "") {
       console.log("Campos vazios ou inválidos.");
       return;
     }
 
     try {
       const response = await api.post("/session", {
         email,
         password,
       });
       
       if(!response.data.token){
         return;
       }
 
       console.log(response.data);
 
       //Cria um tempo estimado para o cookie expirar
     const expressTime = 60 * 60 * 24 * 30 * 1000;
     //Função assincrona
     const cookieStore = await cookies();
     cookieStore.set("session", response.data.token,{
     //Tempo que queremos que o cookie expire
       maxAge: expressTime,
       path:"/",
       httpOnly: false,
     //Só habilitar em produção pois ainda estamos em localhost
     secure: process.env.NODE_ENV === "production"
       })
       
 
     } catch (err) {
       console.log("Erro ao fazer login:", err);
      //ADICIONAR UM AVISO DE ERRO NA TELA
       return;
     } 
       redirect("/dashboard/ticketscount");
   }

  return (
    <div className={styles.container}>
      {/* Logo centralizada acima do card */}
     

      <div className={styles.conteiner}>
        <section className={styles.login}>

           <Image
        src={logoImg}
        alt="Logo SF2"
        width={200}
        height={100}
        className={styles.logo}
      />

          <h1>Faça seu Login</h1>

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

          {/* Links de cadastro / dashboard (comentados por enquanto) */}
          {/*
          <Link href="/signup_empresa" className={styles.text}>
            Não possui uma conta? Cadastre uma empresa
          </Link>

          <Link href="/signup_instituicao" className={styles.text}>
            Não possui uma conta? Cadastre uma instituição
          </Link>

          <Link href="/dashboard/ticketscount" className={styles.text}>
            Dashboard
          </Link>
          */}
        </section>
      </div>
    </div>
  );
}
