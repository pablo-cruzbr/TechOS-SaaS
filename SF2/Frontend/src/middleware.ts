import { NextRequest, NextResponse } from "next/server"
import { getCookieServer } from "./lib/cookieServer";
import { api } from "./services/api";

export async function middleware(req: NextRequest){
    // 1- PEGAR A URL DA PAGINA 
    const { pathname } = req.nextUrl
    
    // 2 - PRIMEIRA VALIDAÇÃO DE URL 
    if( pathname.startsWith("/_next") || pathname === "/"){
        return NextResponse.next();
    }
    
    // 3 - PEGAR O TOKEN DO USUÁRIO
    const token = await getCookieServer();

    // 4 - BLOQUEIO DE ACESSO CASO NÃO TENHA TOKEN
    if(pathname.startsWith("/dashboard")){
        if(!token){
            return NextResponse.redirect(new URL("/", req.url))
        }

        // 5 - Validar o Token Função: validateToken
        const isValid = await validateToken(token)
        if(!isValid){
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    return NextResponse.next();
    
    // FUNÇÃO PARA VALIDAR TOKEN
  async function validateToken(token: string) {
    if (!token) return false;
    
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/detail`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store' 
        });

        if (!res.ok) return false;

        const data = await res.json();

        return !!data?.isAdmin; 

    } catch (err) {
        console.error("Erro na validação do Middleware:", err);
        return false;
    }
}
}