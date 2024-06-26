import type { Server } from '@prisma/client'
import type { MemberWithProfile, ServerWithDetails } from '~/types'
import type { ServerPayload } from '~/validations/server'

export function createServer(payload: ServerPayload) {
  return useNuxtApp().$api<Server>('/servers', {
    method: 'POST',
    body: payload,
  })
}

export function joinServer(inviteCode: string) {
  return useNuxtApp().$api<{ serverId: string }>(`servers/join`, {
    method: 'POST',
    body: { inviteCode },
  })
}

export function leaveServer(id: string) {
  return useNuxtApp().$api(`servers/${id}/leave`, { method: 'PATCH' })
}

export function deleteServer(id: string) {
  return useNuxtApp().$api(`servers/${id}`, { method: 'DELETE' })
}

export function getUserServers() {
  return useNuxtApp().$api<Server[]>('/servers')
}

export function getServerMembers(id: string) {
  return useNuxtApp().$api<MemberWithProfile[]>(`/servers/${id}/members`)
}

export function getServerDetails(id: string) {
  return useNuxtApp().$api<ServerWithDetails>(`/servers/${id}`)
}
