// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Minha Aplicação',
  description: 'Plataforma multitenant com editor de temas',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Painel</title>
        {/* Tailwind CDN */}
        <script
          src="https://cdn.tailwindcss.com"
          suppressHydrationWarning
        ></script>
        {/* (Opcional) Config inicial do Tailwind */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      primary: '#6366f1',
                    }
                  }
                }
              }
            `
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
