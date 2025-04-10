import '../globals.css';
import { auth0 } from "@/lib/auth0";

import { redirect } from 'next/navigation'
import { getSessionOrRedirect } from '../getSession';


export default async function DashboardPage() {

  const session = await getSessionOrRedirect()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-primary mb-2">Bem-vindo ao seu dashboard {session.user.name}</h1>
      <p>
       <a href="/auth/logout">
        <button>Log out</button>
        </a>
      </p>
      <p className="text-gray-600">Gerencie o tema da sua loja.</p>
    </div>
  )
}
