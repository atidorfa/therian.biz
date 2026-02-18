import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

export default async function HomePage() {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const therian = await db.therian.findUnique({
    where: { userId: session.user.id },
  })

  if (!therian) {
    redirect('/adopt')
  }

  redirect('/therian')
}
