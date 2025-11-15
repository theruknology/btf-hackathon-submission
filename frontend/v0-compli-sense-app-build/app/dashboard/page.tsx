"use client"

import { useState } from 'react'
import { AlertTriangle, Check, ExternalLink, Info, FileText, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ComplianceChart } from "@/components/compliance-chart"
import { dummyAlerts } from '@/lib/dummy-data'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [alerts] = useState(dummyAlerts)
  const [generatedReports, setGeneratedReports] = useState<Set<number>>(new Set([1, 2]))

  const handleGenerateReport = (alertId: number) => {
    setGeneratedReports(prev => new Set([...prev, alertId]))
    setTimeout(() => {
      router.push('/reports')
    }, 800)
  }

  const tasks = [
    { title: "Review: Q4 KSA Filing", status: "pending", priority: "high" },
    { title: "Update AML Procedures", status: "pending", priority: "medium" },
    { title: "Customer Data Audit", status: "completed", priority: "low" }
  ]

  const stats = [
    { label: "Active Alerts", value: alerts.filter(a => a.action_required).length, icon: AlertTriangle, color: "text-warning" },
    { label: "Reports Generated", value: generatedReports.size, icon: FileText, color: "text-primary" },
    { label: "Compliance Score", value: "87%", icon: TrendingUp, color: "text-success" }
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Compliance Dashboard</h1>
        <p className="text-muted-foreground text-lg">Stay ahead of regulatory changes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-10 w-10 ${stat.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Main Column - Alert Feed */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Compliance Alert Feed</h2>
          
          {alerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl text-balance">{alert.title}</CardTitle>
                  <span className="text-sm text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(alert.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {alert.action_required ? (
                    <Badge variant="destructive" className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Action Required
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1.5 bg-info text-info-foreground">
                      <Info className="h-3.5 w-3.5" />
                      FYI: Policy Update
                    </Badge>
                  )}
                  <Badge variant="outline" className={
                    alert.severity === "high" ? "border-warning text-warning" :
                    alert.severity === "medium" ? "border-primary text-primary" :
                    "border-muted-foreground text-muted-foreground"
                  }>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-foreground/90 leading-relaxed text-pretty">
                  {alert.description}
                </p>
                
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-pretty">Source: {alert.source}</span>
                  </div>
                  
                  {generatedReports.has(alert.id) ? (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => router.push('/reports')}
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" />
                      View Report
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateReport(alert.id)}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* My Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">My Tasks</CardTitle>
              <CardDescription>Pending compliance actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer group">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    task.status === "completed" ? "bg-success" : 
                    task.priority === "high" ? "bg-warning animate-pulse" :
                    "bg-primary"
                  }`} />
                  <span className="flex-1 text-sm font-medium text-pretty group-hover:text-primary transition-colors">
                    {task.title}
                  </span>
                  {task.status === "completed" && <Check className="h-4 w-4 text-success flex-shrink-0" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Compliance Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Compliance Score</CardTitle>
              <CardDescription>Overall compliance health</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplianceChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
