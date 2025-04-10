import { auth0 } from "@/lib/auth0";
import './globals.css';
import { redirect } from 'next/navigation'

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If no session, show sign-up and login buttons
  if (!session) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo</h1>
          <p className="text-gray-600 mb-6">Gerencie sua loja</p>
  
          <div className="space-y-4">
            <a href="/auth/login?screen_hint=signup">
              <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Criar conta
              </button>
            </a>
            <br></br>

            <br></br>

            <a href="/auth/login">
              
              <button className="w-full px-6 py-3 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg transition">
                Entrar
              </button>
            </a>
          </div>
        </div>
      </main>
    )
  }

  // If session exists, show a welcome message and logout button
  console.log(session)
  redirect('/dashboard')

  return null;
  // return (
  //   <main>
  //     <h1>Welcome, {session.user.name}!</h1>
  //     <p>
  //       <a href="/auth/logout">
  //         <button>Log out</button>
  //       </a>
  //     </p>
  //   </main>
  // );
}
