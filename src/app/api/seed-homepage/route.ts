import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { homePageSeed } from '@/endpoints/seed/homepage-seed'

export const POST = async () => {
  try {
    const payload = await getPayload({ config: configPromise })

    await homePageSeed({ payload, req: {} as any })

    return Response.json({ success: true, message: 'Homepage created successfully!' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
