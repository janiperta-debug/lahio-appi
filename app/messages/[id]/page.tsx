"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, MoreVertical, Shield, Clock, AlertTriangle, UserX, Star } from "lucide-react"
import Link from "next/link"
import ReportUserModal from "@/components/report-user-modal"
import BlockUserModal from "@/components/block-user-modal"
import RateUserModal from "@/components/rate-user-modal"

export default function ConversationPage({ params }: { params: { id: string } }) {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showRateModal, setShowRateModal] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  // Mock conversation data
  const conversation = {
    id: 1,
    name: "Anna",
    avatar: "A",
    online: true,
    lastSeen: "Aktiivinen nyt",
  }

  const messages = [
    {
      id: 1,
      sender: "Anna",
      content: "Hei! Näin ilmoituksesi että voisit auttaa ostoksissa. Olisiko sinulla aikaa huomenna?",
      timestamp: "2 päivää sitten 14:30",
      isOwn: false,
    },
    {
      id: 2,
      sender: "Sinä",
      content: "Hei Anna! Kyllä voin auttaa. Mihin aikaan sopisi parhaiten?",
      timestamp: "2 päivää sitten 15:15",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Anna",
      content: "Kiitos! Aamupäivä olisi hyvä, ehkä klo 10 aikoihin? Tarvitsen vain muutaman tuotteen K-marketista.",
      timestamp: "2 päivää sitten 15:20",
      isOwn: false,
    },
    {
      id: 4,
      sender: "Sinä",
      content: "Sopii hyvin! Klo 10 K-marketilla. Lähetä lista tuotteista niin voin katsoa ne valmiiksi.",
      timestamp: "2 päivää sitten 15:25",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Anna",
      content: "Kiitos avusta ostoksissa! Oli mukava tavata sinua ja lapsia. Lapset puhuivat leikistä koko illalla.",
      timestamp: "2 tuntia sitten",
      isOwn: false,
    },
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-cyan-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/messages"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                    <span className="text-cyan-800 font-semibold">{conversation.avatar}</span>
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h1 className="font-semibold text-slate-800 font-sans">{conversation.name}</h1>
                  <p className="text-xs text-slate-600">{conversation.lastSeen}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/profile/${conversation.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
                >
                  Näytä profiili
                </Button>
              </Link>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-10 min-w-[160px]">
                    {/* Added rate user option to messaging dropdown */}
                    <button
                      onClick={() => {
                        setShowRateModal(true)
                        setShowMoreMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Arvostele käyttäjä
                    </button>
                    <button
                      onClick={() => {
                        setShowReportModal(true)
                        setShowMoreMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Raportoi käyttäjä
                    </button>
                    <button
                      onClick={() => {
                        setShowBlockModal(true)
                        setShowMoreMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <UserX className="w-4 h-4" />
                      Estä käyttäjä
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md ${message.isOwn ? "order-2" : "order-1"}`}>
                <Card
                  className={`${
                    message.isOwn ? "bg-cyan-800 text-white border-cyan-800" : "bg-white border-slate-200"
                  } shadow-sm`}
                >
                  <CardContent className="p-3">
                    <p className={`text-sm leading-relaxed ${message.isOwn ? "text-white" : "text-slate-700"}`}>
                      {message.content}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3 opacity-60" />
                      <span className={`text-xs opacity-60 ${message.isOwn ? "text-cyan-100" : "text-slate-500"}`}>
                        {message.timestamp}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs">
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 ml-2">Anna kirjoittaa...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <Textarea
                placeholder="Kirjoita ystävällinen viesti..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[44px] max-h-32 border-slate-300 focus:border-cyan-800 focus:ring-cyan-800 resize-none"
                rows={1}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-cyan-800 hover:bg-cyan-900 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Safety reminder */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <Shield className="w-3 h-3" />
            <span>Muista olla ystävällinen ja kunnioittava. Raportti sopimattomasta käytöksestä.</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReportUserModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        userName={conversation.name}
        userId={conversation.id.toString()}
      />
      <BlockUserModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        userName={conversation.name}
        userId={conversation.id.toString()}
      />
      {/* Added rating modal to messaging interface */}
      <RateUserModal
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
        userName={conversation.name}
        userId={conversation.id.toString()}
        interactionType="viestintä"
      />
    </div>
  )
}
