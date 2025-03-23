import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import clsx from 'clsx'
import { useState } from 'react'
import ArrowUpTray from '../assets/ArrowUpTray'
import ChatBubble from '../assets/ChatBubble'
import Menu from '../assets/Menu'
import Search from '../assets/Search'
import ResizeableElement from '../components/ResizeableElement'

export const Route = createFileRoute('/')({
  component: Index,
})

const MockDMs = [
  {
    id: 1,
    name: 'User 1',
    message: 'Hello!',
  },
  {
    id: 2,
    name: 'User 2',
    message: 'How are you?',
  },
]

const MockServers = [
  {
    id: 1,
    name: 'Server 1',
    status: 'online',
  },
  {
    id: 2,
    name: 'Server 2',
    status: 'offline',
  },
  {
    id: 3,
    name: 'Server 3  to test truncating',
    status: 'online',
  },
]

function Index() {
  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['test'],
      queryFn: async () => {
        const res = await fetch('http://localhost:8080/api/users')
        const jsonData = await res.json()
        return jsonData
      },
    })
  )

  console.log('++ ', data)

  const [showSidebar, setShowSidebar] = useState(true)
  return (
    <div className="h-full flex overflow-auto p-4">
      {/* Sidebar */}
      {showSidebar && <SideBar setShowSidebar={setShowSidebar} />}

      {!showSidebar && (
        <div className="fixed z-10 inset-0 h-full w-[12px] group">
          <div className="flex flex-col gap-4 h-full w-fit py-4 px-2 text-[#B2B5C9] bg-[#1A191C]/40 backdrop-blur -translate-x-full transition-transform group-hover:translate-x-0">
            <div className="flex items-center justify-center min-w-16">
              <Search className="size-6" />
            </div>
            <div className="h-[4px] my-2 bg-[#232526]" />
            <div className="flex items-center justify-center min-w-16">
              <ChatBubble className="size-6" />
            </div>
            {MockDMs.map(() => {
              return (
                <div className="rounded-lg p-2 transition-colors hover:bg-[#35373d]">
                  <div className="size-16 min-w-16 p-2 rounded-full bg-[#25262B]">
                    <img src="/discord-icon.svg" />
                  </div>
                </div>
              )
            })}
            <div className="h-[4px] my-2 bg-[#232526]" />
            <div className="flex items-center justify-center min-w-16">
              <Menu className="size-10" />
            </div>
            {MockServers.map(() => {
              return (
                <div className="rounded-lg p-2 transition-colors hover:bg-[#35373d]">
                  <div className="size-16 min-w-16 p-2 rounded-full bg-[#25262B]">
                    <img src="/discord-icon.svg" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 flex-1">
        <header className="p-4 bg-[#1A191C] rounded-lg">
          <button
            className={clsx(
              'text-[#B2B5C9] transition-opacity',
              showSidebar && 'opacity-0 pointer-events-none'
            )}
            onClick={() => setShowSidebar((prev) => !prev)}
          >
            <ArrowUpTray className="w-6 rotate-90 cursor-pointer" />
          </button>
        </header>
        <div className="h-full min-w-96 gap-12 p-8 bg-[#25262B] rounded-lg flex">
          <button
            onClick={async () => {
              await fetch('http://localhost:8080/api/user', {
                method: 'POST',
                body: JSON.stringify({ username: 'jimbo', age: 23 }),
              })
            }}
            className="bg-[#1A1C1E] size-20 text-white/80"
          >
            Add user
          </button>
        </div>
      </div>
    </div>
  )
}

function DMRow({ name, message }: { name: string; message: string }) {
  return (
    <div className="flex gap-4 p-2 rounded-lg transition-colors items-center select-none hover:bg-[#35373d]">
      <div className="size-16 min-w-16 p-2 rounded-full bg-[#25262B]">
        <img src="/discord-icon.svg" />
      </div>
      <div className="flex size-full flex-col justify-between whitespace-nowrap @container">
        <p className="text-xl truncate">{name}</p>
        <p className="text-sm text-[#B2B5C9]/60 truncate">{message}</p>
      </div>
    </div>
  )
}

function ServerRow({ name, status }: { name: string; status: string }) {
  return (
    <div className="flex gap-4 p-2 rounded-lg transition-colors items-center select-none hover:bg-[#35373d]">
      <div className="size-16 min-w-16 p-2 rounded-full bg-[#25262B]">
        <img src="/discord-icon.svg" />
      </div>
      <div className="flex size-full flex-col justify-between whitespace-nowrap @container">
        <p className="text-xl truncate">{name}</p>
        <p className="text-sm text-[#B2B5C9]/60 truncate">{status}</p>
      </div>
    </div>
  )
}

function SideBar({
  setShowSidebar,
}: {
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <ResizeableElement
      startingWidth={450}
      maxWidth={450}
      snapToZero={200}
      onSnapEnd={() => setShowSidebar(false)}
    >
      <div className="flex flex-col size-full pr-4 text-[#B2B5C9] font-FunnelSans overflow-hidden">
        <div className="flex p-2 gap-4 items-center mb-2">
          <div className="flex items-center justify-center min-w-16">
            <Search className="size-6" />
          </div>
          <input
            className="w-full text-xl p-2 transition-colors focus:outline-none rounded-lg focus:bg-[#35373d]"
            placeholder="Search"
          />
        </div>

        <div className="h-[4px] my-2 bg-[#232526]" />

        <div className="flex p-2 gap-4 items-center mb-2">
          <div className="flex items-center justify-center min-w-16">
            <ChatBubble className="size-6" />
          </div>
          <h2 className="text-lg">Messages</h2>
        </div>

        <div className="flex gap-4 text-xl flex-col">
          {MockDMs.map(({ id, name, message }) => {
            return <DMRow key={id} name={name} message={message} />
          })}
        </div>

        <div className="h-[4px] my-2 bg-[#232526]" />

        <div className="flex p-2 gap-4 items-center mb-2">
          <div className="flex items-center justify-center min-w-16">
            <Menu className="size-10" />
          </div>
          <h2 className="text-lg">Servers</h2>
        </div>

        <div className="flex gap-4 text-xl flex-col">
          {MockServers.map(({ id, name, status }) => {
            return <ServerRow key={id} name={name} status={status} />
          })}
        </div>
      </div>
    </ResizeableElement>
  )
}
