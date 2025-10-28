import type { Endpoint } from 'payload'
import { recreateHomePage } from '../scripts/content-manager'

export const seedHomepageEndpoint: Endpoint = {
  path: '/seed-homepage',
  method: 'post',
  handler: async (req) => {
    // Защита: проверяем секретный ключ или аутентификацию
    const authHeader = req.headers.get('authorization')
    const expectedToken = process.env.SEED_SECRET || process.env.CRON_SECRET
    
    // В production должен быть установлен SEED_SECRET
    if (process.env.NODE_ENV === 'production' && !expectedToken) {
      return Response.json(
        { success: false, error: 'Endpoint disabled in production without SEED_SECRET' },
        { status: 403 }
      )
    }
    
    // Проверяем токен
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      const result = await recreateHomePage()
      return Response.json({ 
        success: true, 
        message: 'Homepage created successfully!',
        pageId: result.id 
      })
    } catch (error: any) {
      return Response.json({ success: false, error: error.message }, { status: 500 })
    }
  },
}
