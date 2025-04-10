import { NextRequest } from 'next/server'
import { getAccessToken } from '@auth0/nextjs-auth0'
import { getSessionOrRedirect } from '../../getSession';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionOrRedirect()

    if (!session) {
      return new Response(JSON.stringify({ error: 'No access token found' }), { status: 401 })
    }

    const accessToken = session.tokenSet.accessToken;

    return new Response(JSON.stringify({ accessToken }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('[TOKEN ERROR]', err)
    return new Response(JSON.stringify({ error: err }), { status: 500 })
  }
}
