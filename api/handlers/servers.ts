import type { Server } from '@prisma/client'
import type { MemberWithProfile } from '~/types'
import type { ServerPayload } from '~/validations/server'

export function createServerHandler(payload: ServerPayload) {
  return useAPI<Server>('/servers', {
    method: 'POST',
    body: payload,
  })
}

export function getServerMembers(id: string) {
  return useNuxtApp().$api<MemberWithProfile[]>(`/servers/${id}/members`)
}
