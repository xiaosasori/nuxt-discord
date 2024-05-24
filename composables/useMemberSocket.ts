import { useQueryClient } from '@tanstack/vue-query'
import type { MemberWithProfile } from '~/types'

export function useMemberSocket(serverId: string) {
  const cache = useQueryClient()
  const { socket } = useSocket()

  onMounted(() => {
    socket.on('toggle_online', (profileId: string) => {
      cache.setQueryData(
        [serversKey, serverId, 'members'],
        (data: MemberWithProfile[] | undefined): any => {
          if (!data) return
          const res = structuredClone(data)
          const member = res.find((m) => m.profileId === profileId)
          if (!member) return
          member.profile.isOnline = true

          return res
        },
      )
    })

    socket.on('toggle_offline', (profileId: string) => {
      cache.setQueryData(
        [serversKey, serverId, 'members'],
        (data: MemberWithProfile[] | undefined): any => {
          if (!data) return
          const res = structuredClone(data)
          const member = res.find((m) => m.profileId === profileId)
          if (!member) return
          member.profile.isOnline = false

          return res
        },
      )
    })

    socket.on('add_member', (newMember: MemberWithProfile) => {
      console.info('add_member', newMember)
      cache.setQueryData(
        [serversKey, serverId, 'members'],
        (data: MemberWithProfile[] | undefined): any => {
          if (!data) return
          return [...data, newMember].sort((a, b) =>
            a.profile.username.localeCompare(b.profile.username),
          )
        },
      )
    })

    socket.on('remove_member', (profileId: string) => {
      console.log('remove_member', profileId)
      cache.setQueryData(
        [serversKey, serverId, 'members'],
        (data: MemberWithProfile[] | undefined): any => {
          if (!data) return
          return data.filter((m) => m.profileId !== profileId)
        },
      )
    })
  })
}