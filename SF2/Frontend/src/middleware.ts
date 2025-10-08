import { NextRequest, NextResponse } from "next/server"
import { getCookieServer } from "./lib/cookieServer";
import { redirect } from "next/dist/server/api-utils";
import { api } from "./services/api";
export async function middleware(req: NextRequest){
        // 1- PEGAR A URL DA PAGINA 
        // nextUrl devolve o patchName:  /dashboard/signup
        
        const {pathname} = req.nextUrl
        
        //2 - PRIMEIRA VALIDAÇÃO DE URL 
        // Se o patchname for igual o nosso barra eu vou deixar renderizar
        if( pathname.startsWith("/_next") || pathname === "/"){
            return NextResponse.next();
        }
        
        // 3 - PEGAR O TOKEN DO USUÁRIO
       const token = await getCookieServer();
       //console.log(token);

       //4 - BLOQUEIO DE ACESSO CASO NÃO TENHA TOKEN
       // Se o pathname cameçar com /dashboard não tiver o token, vamos redirecionar para a pagina /. Com o redirect.

       if(pathname.startsWith("/dashboard")){
        if(!token){
            return NextResponse.redirect(new URL("/", req.url))
        }

         //6 - Varialvel isValid + Condicional + Function para VALIDADE TOKEN
        const isValid = await validateToken(token)
        if(!isValid){
            return NextResponse.redirect(new URL("/", req.url))
        }

       }
       return NextResponse.next();
       
        // 5 - Validar o Token Função: validateToken.
        async function validateToken(token: string){
        if(!token) return false;
        //Requisição para Buscar os dados do usuário 
        // api.get me, Bearer token. 
        try {
         await api.get("/users/detail",{
             headers:{
                 Authorization: `Bearer ${token}`
             }
         })
         return true;
        }catch(err){
         console.log(err);
         return false;
    }
}
}