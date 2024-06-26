<script setup lang="ts">
import type { Channel } from '@prisma/client'
import { isSameHour } from 'date-fns'

defineProps<{
  channel: Channel
  type: string
}>()

const route = useRoute()
const serverId = route.params.sid as string
const channelId = route.params.cid as string

const queryKey = `chat:${channelId}`
const addKey = `chat:${channelId}:messages`
const updateKey = `chat:${channelId}:messages:update`
const deleteKey = `chat:${channelId}:messages:delete`

const {
  data: messages,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
  suspense,
} = useChatQuery({
  queryKey,
  apiUrl: '/messages',
  paramKey: 'channelId',
  paramValue: channelId,
})

await suspense()

useChatSocket({ channelId, queryKey, addKey, updateKey, deleteKey })
const chatRef = ref()
const bottomRef = ref()
useChatScroll({
  chatRef,
  bottomRef,
  loadMore: fetchNextPage,
  shouldLoadMore: computed(
    () => !isFetchingNextPage.value && !!hasNextPage.value,
  ),
})
</script>

<template>
  <div ref="chatRef" class="flex">
    <div
      v-if="status === 'pending'"
      class="flex flex-1 flex-col items-center justify-center"
    >
      <Icon
        class="my-4 animate-spin text-zinc-500"
        size="28px"
        name="lucide:loader-2"
      />
      <p class="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        Loading messages...
      </p>
    </div>
    <div
      v-if="status === 'error'"
      class="flex flex-1 flex-col items-center justify-center"
    >
      <Icon class="my-4 text-zinc-500" size="28px" name="lucide:server-crash" />
      <p class="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        Something went wrong!
      </p>
    </div>
    <div
      v-if="status === 'success' && messages"
      class="mt-auto flex flex-1 flex-col-reverse"
    >
      <!-- intro -->
      <template v-for="(group, groupIndex) in messages.pages" :key="groupIndex">
        <ChatItem
          v-for="(message, i) in group.items"
          :key="message.id"
          :message="message"
          :show-header="
            i === group.items.length - 1 ||
            message.memberId !== group.items[i + 1].memberId ||
            !isSameHour(message.createdAt, group.items[i + 1].createdAt)
          "
          :url-query="`serverId=${serverId}&channelId=${channelId}`"
        />
      </template>
      <div class="mt-4 h-px bg-divider"></div>
      <div class="select-none space-y-2 px-4 pt-4">
        <div>
          <img
            class="h-20 w-20 rounded-full"
            src="@/assets/discord.png"
            alt="logo"
          />
        </div>
        <template v-if="$route.params.cid">
          <h1 class="text-4xl font-bold text-white">
            Welcome to <span class="italic">#{{ channel.name }}!</span>
          </h1>
          <p class="">
            This is the start of the
            <span class="italic">#{{ channel.name }}</span> channel.
          </p>
        </template>
        <template v-else>
          <h1 class="truncate text-4xl font-bold text-white">
            {{ channel.name }}
          </h1>
          <p class="">
            This is the beginning of your direct message history with
            <b>@{{ channel.name }}</b>
          </p>
        </template>
      </div>
    </div>
    <div ref="bottomRef"></div>
  </div>
</template>
