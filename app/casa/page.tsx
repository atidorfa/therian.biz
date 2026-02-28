import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { toTherianDTO } from '@/lib/therian-dto'
import CasaRoom from '@/components/CasaRoom'

export const dynamic = 'force-dynamic'

export default async function CasaPage() {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { level: true },
  })

  // La Casa solo está disponible para usuarios nivel 2+
  if (!user || user.level < 2) {
    redirect('/therian')
  }

  const therian = await db.therian.findFirst({
    where: { userId: session.user.id },
  })

  if (!therian) {
    redirect('/adopt')
  }

  const dto = toTherianDTO(therian)

  return <CasaRoom therian={dto} userLevel={user.level} />
}
