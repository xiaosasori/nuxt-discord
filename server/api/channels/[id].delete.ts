import { MemberRole } from '@/types'
import db from '@/lib/prisma'
import socketServer from '~/lib/socket'

export default defineEventHandler(async (event) => {
  const { serverId, categoryId } = getQuery<{
    serverId: string
    categoryId: string
  }>(event)

  if (!serverId)
    return createError({ statusMessage: 'Server ID missing', status: 400 })

  if (!categoryId)
    return createError({ statusMessage: 'Category ID missing', status: 400 })

  const channelId = getRouterParam(event, 'id')
  if (!channelId)
    return createError({ statusMessage: 'Channel ID missing', status: 400 })

  const category = await db.category.update({
    where: {
      id: categoryId,
      server: {
        id: serverId,
        members: {
          some: {
            profileId: event.context.auth.sub,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
    },
    data: {
      channels: {
        delete: {
          id: channelId,
          name: {
            not: 'general',
          },
        },
      },
    },
  })
  socketServer.io?.to(serverId).emit('delete_channel', category)
  return category
})
