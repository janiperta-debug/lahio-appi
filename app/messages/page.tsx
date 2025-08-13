"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageCircle, Search, ArrowLeft, Clock, MoreVertical } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Anna",
      lastMessage: "Kiitos avusta ostoksissa! Oli mukava tavata sinua ja lapsia.",
      timestamp: "2 tuntia sitten",
      unread: false,
      avatar: "A",
      online: true,
    },
    {
      id: 2,
      name: "Mikko",
      lastMessage: "Hei! Olisiko sinulla aikaa auttaa tietokoneen kanssa huomenna?",
      timestamp: "4 tuntia sitten",
      unread: true,
      avatar: "M",
      online: false,
    },
    {
      id: 3,
      name: "Sari",
      lastMessage: "Leikkipäivä oli loistava! Lapset puhuivat siitä koko illalla.",
      timestamp: "1 päivä sitten",
      unread: false,
      avatar: "S",
      online: true,
    },
    {
      id: 4,
      name: "Elina",
      lastMessage: "Käsityökerho oli mukava. Milloin seuraava tapaaminen?",
      timestamp: "2 päivää sitten",
      unread: false,
      avatar: "E",
      online: false,
    },
    {
      id: 5,
      name: "Pekka",
      lastMessage: "Hylly on nyt kiinnitetty! Kiitos että annoit työkalut lainaan.",
      timestamp: "3 päivää sitten",
      unread: false,
      avatar: "P",
      online: false,
    },
  ]

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const unreadCount = conversations.filter((conv) => conv.unread).length

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Takaisin etusivulle
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-800 font-sans mb-2">Viestit</h1>
              <p className="text-stone-600 leading-relaxed">
                Keskustele naapureiden kanssa turvallisesti ja yksityisesti
              </p>
            </div>
            {unreadCount > 0 && <Badge className="bg-amber-700 text-white">{unreadCount} lukematonta</Badge>}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <Input
              placeholder="Etsi keskusteluja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-stone-300 focus:border-amber-700 focus:ring-amber-700 bg-white"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <Link key={conversation.id} href={`/messages/${conversation.id}`}>
              <Card
                className={`bg-white border-stone-200 hover:shadow-md transition-shadow cursor-pointer ${
                  conversation.unread ? "border-l-4 border-l-amber-700" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-700 font-semibold">{conversation.avatar}</span>
                      </div>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-semibold font-sans ${
                            conversation.unread ? "text-stone-900" : "text-stone-800"
                          }`}
                        >
                          {conversation.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-stone-500">
                            <Clock className="w-3 h-3" />
                            {conversation.timestamp}
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p
                        className={`text-sm truncate ${
                          conversation.unread ? "text-stone-700 font-medium" : "text-stone-600"
                        }`}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-600 mb-2">Ei keskusteluja</h3>
            <p className="text-stone-500 mb-4">
              {searchQuery ? "Hakuehdoilla ei löytynyt keskusteluja." : "Aloita keskustelu naapureiden kanssa."}
            </p>
            <Link href="/discover">
              <Button className="bg-amber-700 hover:bg-amber-800 text-white">Löydä naapureita</Button>
            </Link>
          </div>
        )}

        {/* Safety Notice */}
        <Card className="mt-8 bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageCircle className="w-8 h-8 text-amber-700 mx-auto mb-3" />
              <h4 className="font-semibold text-amber-800 text-sm mb-2">Turvallinen viestintä</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                Kaikki viestit ovat yksityisiä ja salattuja. Voit estää käyttäjän tai raportoida sopimattomasta
                käytöksestä milloin tahansa.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
