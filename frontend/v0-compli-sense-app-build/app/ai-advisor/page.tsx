"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { generateDummyResponse } from '@/lib/dummy-data'

type Message = {
  role: "user" | "assistant"
  content: string
  citations?: { id: string; source: string; page?: string }[]
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "I am your AI Compliance Advisor. I only answer using official GCC government documents. How can I help you evaluate your new 'Buy Now, Pay Later' idea?"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const response = generateDummyResponse(input)
      
      const citations = response.citations.map((source, index) => ({
        id: (index + 1).toString(),
        source: source.source,
        page: source.page
      }))

      const aiMessage: Message = {
        role: "assistant",
        content: response.answer,
        citations: citations
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const suggestedQuestions = [
    "What are the licensing requirements for BNPL in UAE?",
    "Do I need Sharia compliance for KSA operations?",
    "What are the data protection requirements?",
    "What are the consumer disclosure requirements?"
  ]

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const renderMessageWithCitations = (message: Message) => {
    if (!message.citations) return message.content

    let content = message.content
    message.citations.forEach(citation => {
      const citationBadge = `[${citation.id}]`
      content = content.replace(
        citationBadge,
        `<citation-${citation.id}>${citationBadge}</citation-${citation.id}>`
      )
    })

    const parts = content.split(/(<citation-\d+>.*?<\/citation-\d+>)/)
    
    return (
      <div className="inline">
        {parts.map((part, index) => {
          const match = part.match(/<citation-(\d+)>(.*?)<\/citation-\d+>/)
          if (match) {
            const citationId = match[1]
            const citation = message.citations?.find(c => c.id === citationId)
            if (!citation) return part

            return (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/20 transition-colors mx-0.5 text-xs"
                  >
                    {match[2]}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Source:</p>
                    <p className="text-sm text-balance">{citation.source}</p>
                    {citation.page && (
                      <p className="text-xs text-muted-foreground">{citation.page}</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )
          }
          return <span key={index}>{part}</span>
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">AI Advisor</h1>
        </div>
        <p className="text-muted-foreground text-lg">Ask questions about GCC compliance regulations</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
            )}
            
            <Card className={`max-w-[75%] p-4 ${
              message.role === "user" 
                ? "bg-primary text-primary-foreground" 
                : "bg-card"
            }`}>
              <div className="text-[15px] leading-relaxed">
                {message.role === "assistant" 
                  ? renderMessageWithCitations(message)
                  : message.content
                }
              </div>
            </Card>

            {message.role === "user" && (
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                <User className="h-5 w-5 text-accent-foreground" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <Card className="max-w-[75%] p-4 bg-card">
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </Card>
          </div>
        )}

        {messages.length === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">Try asking:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 text-left justify-start text-sm hover:bg-primary/10 hover:border-primary transition-colors"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-border bg-card">
        <form onSubmit={handleSend} className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about compliance regulations..."
            className="flex-1 h-12 text-base"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="h-12 w-12 flex-shrink-0" disabled={isLoading || !input.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
