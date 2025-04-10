// app/layout.tsx
import type { Metadata } from 'next'
import AdminLayout from '../../components/AdminLayout'

export const metadata: Metadata = {
  title: 'Painel do Admin',
  description: 'Gerencie sua loja',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  )
}
