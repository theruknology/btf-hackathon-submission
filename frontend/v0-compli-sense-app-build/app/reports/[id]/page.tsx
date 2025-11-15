"use client"

import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CheckCircle2, Clock, FileEdit, Download, Share2, AlertCircle } from 'lucide-react'
import { dummyReports } from '@/lib/dummy-data'
import { useParams, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { useToast } from '@/hooks/use-toast'

export default function ReportReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [report, setReport] = useState<any>(null)
  const [localStatus, setLocalStatus] = useState<string>("")

  useEffect(() => {
    const reportData = dummyReports.find(r => r.id === Number(params.id))
    if (reportData) {
      setReport(reportData)
      setLocalStatus(reportData.status)
    }
  }, [params.id])

  const handleApprove = () => {
    setLocalStatus("approved")
    toast({
      title: "Report Approved",
      description: "The report has been successfully approved.",
    })
  }

  const handleRequestRevision = () => {
    toast({
      title: "Revision Requested",
      description: "A revision request has been sent to the AI team.",
    })
  }

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your report is being downloaded as PDF.",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share Link Copied",
      description: "The report link has been copied to your clipboard.",
    })
  }

  if (!report) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Report not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push('/reports')}>
            Back to Reports
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">{report.title}</h1>
          <p className="text-muted-foreground mt-1">Generated from Alert #{report.alert_id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left Column - Report Content */}
        <Card className="min-h-[600px]">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Report Content</CardTitle>
              <Badge 
                variant={localStatus === 'approved' ? 'default' : localStatus === 'pending' ? 'secondary' : 'outline'} 
                className={
                  localStatus === 'approved' 
                    ? 'bg-success text-success-foreground' 
                    : localStatus === 'pending'
                    ? 'bg-warning text-warning-foreground'
                    : 'bg-muted text-muted-foreground'
                }
              >
                {localStatus === 'pending' && 'Pending Review'}
                {localStatus === 'approved' && 'Approved'}
                {localStatus === 'draft' && 'Draft'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-4 pt-6">
            <ReactMarkdown
              className="text-foreground/90 leading-relaxed"
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 first:mt-0" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-foreground mt-6 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-foreground mt-4 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="text-foreground/90 leading-relaxed mb-4" {...props} />,
                ul: ({ node, ...props }) => <ul className="space-y-2 text-foreground/90 mb-4 list-disc pl-6" {...props} />,
                ol: ({ node, ...props }) => <ol className="space-y-2 text-foreground/90 mb-4 list-decimal pl-6" {...props} />,
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                code: ({ node, ...props }) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-6 border-border" {...props} />,
              }}
            >
              {report.content}
            </ReactMarkdown>
          </CardContent>
        </Card>

        {/* Right Sidebar - Sticky */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Review & Approve */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileEdit className="h-5 w-5" />
                Review & Approve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge 
                  variant={localStatus === 'approved' ? 'default' : 'secondary'} 
                  className={
                    localStatus === 'approved' 
                      ? 'bg-success text-success-foreground' 
                      : localStatus === 'pending'
                      ? 'bg-warning text-warning-foreground'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {localStatus === 'pending' && 'Pending Review'}
                  {localStatus === 'approved' && 'Approved'}
                  {localStatus === 'draft' && 'Draft'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full bg-success hover:bg-success/90 text-success-foreground gap-2" 
                  size="lg"
                  onClick={handleApprove}
                  disabled={localStatus === 'approved'}
                >
                  {localStatus === 'approved' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Approved
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Approve Report
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleRequestRevision}
                >
                  <FileEdit className="h-4 w-4" />
                  Request Revision
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Audit Trail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                AI Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-2 rounded-lg bg-accent/30">
                <div className="mt-1">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Triggered by Alert</p>
                  <p className="text-xs text-muted-foreground">Alert #{report.alert_id}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-accent/30">
                <div className="mt-1">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Analyzed by AI Agents</p>
                  <p className="text-xs text-muted-foreground">Crew.ai multi-agent system</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-accent/30">
                <div className="mt-1">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Drafted by LLM</p>
                  <p className="text-xs text-muted-foreground">Gemini 1.5 Pro</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-accent/30">
                <div className="mt-1">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Generated</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(report.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
