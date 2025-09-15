'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  Code,
  FileText,
  Settings,
  Play,
  Bug,
  Copy,
  Check,
  ExternalLink,
  Monitor,
  RefreshCw,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { ExecutionPlan } from '@/lib/types';

interface GenerationResult {
  success: boolean;
  data?: {
    originalQuery: string;
    executionPlan: ExecutionPlan;
    actStructure: any;
    kendoComponents: any;
    routePath: string;
    errors?: {
      actError?: string;
      kendoError?: string;
    };
    metadata: any;
  };
  error?: string;
  metadata?: any;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{
    plan: boolean;
    structure: boolean;
    code: boolean;
  }>({
    plan: false,
    structure: false,
    code: false
  });
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Handle ESC key for fullscreen mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    if (isFullScreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullScreen]);

  const handleGenerate = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/agents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      console.log(data);
      setResult(data);
      setIframeLoading(true); // Reset iframe loading state for new results

      if (!response.ok && !data.data) {
        throw new Error(data.error || 'Failed to generate components');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setError(null);
  };

  const copyToClipboard = async (
    text: string,
    section: 'plan' | 'structure' | 'code'
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [section]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [section]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Page Builder Agent System
          </h1>
          <p className="text-lg text-gray-600">
            Generate Kendo UI React components from natural language
            descriptions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6" id="main-layout">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Generate Components
              </CardTitle>
              <CardDescription>
                Describe the page or components you want to create
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: Create a dashboard with a header, sidebar navigation, main content area with charts, and a data table..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[120px]"
                disabled={isGenerating}
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  onClick={handleGenerate}
                  disabled={isGenerating || !query.trim()}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={isGenerating}
                >
                  Clear
                </Button>
                <Button
                  variant={debugMode ? 'default' : 'outline'}
                  onClick={() => setDebugMode(!debugMode)}
                  disabled={isGenerating}
                  size="sm"
                >
                  <Bug className="h-4 w-4" />
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {result && !result.success && result.data && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-yellow-800">
                      ⚠️ Partial Success
                    </span>
                  </div>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>
                      Execution plan was created successfully, but some steps
                      failed:
                    </p>
                    {result.data.errors?.actError && (
                      <div>
                        <strong>ACT Generation:</strong>{' '}
                        {result.data.errors.actError}
                      </div>
                    )}
                    {result.data.errors?.kendoError && (
                      <div>
                        <strong>Kendo Merge:</strong>{' '}
                        {result.data.errors.kendoError}
                      </div>
                    )}
                    <p className="text-xs mt-2">
                      You can still view the execution plan and any successfully
                      generated components below.
                    </p>
                  </div>
                </div>
              )}

              {debugMode && result && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">
                      Debug Information
                    </span>
                  </div>
                  <div className="text-xs text-yellow-700 space-y-1">
                    <div>
                      <strong>Processing Time:</strong>{' '}
                      {result.metadata?.processingTime
                        ? new Date(
                            result.metadata.processingTime
                          ).toLocaleTimeString()
                        : 'N/A'}
                    </div>
                    <div>
                      <strong>Agents Used:</strong>{' '}
                      {result.metadata?.agentsUsed?.join(', ') || 'N/A'}
                    </div>
                    <div>
                      <strong>Estimated Duration:</strong>{' '}
                      {result.metadata?.planMetadata?.estimatedDuration
                        ? `${result.metadata.planMetadata.estimatedDuration}s`
                        : 'N/A'}
                    </div>
                    <div>
                      <strong>Plan Format:</strong> Markdown
                    </div>
                    {result.data?.metadata?.partialSuccess && (
                      <div>
                        <strong>Status:</strong>{' '}
                        <span className="text-yellow-600">Partial Success</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Generated Components
              </CardTitle>
              <CardDescription>
                View the generated execution plan, ACT structure, and Kendo
                components
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <Tabs
                  defaultValue={result.data?.routePath ? 'preview' : 'overview'}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="plan">Plan</TabsTrigger>
                    <TabsTrigger value="structure">ACT</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Original Query</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {result.data?.originalQuery}
                      </p>
                    </div>

                    {result.data?.routePath && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Generated Page</h4>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Live at:{' '}
                                <code className="bg-green-100 px-2 py-1 rounded text-xs font-mono">
                                  {result.data.routePath}
                                </code>
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(result.data?.routePath, '_blank')
                              }
                              className="flex items-center gap-1 text-green-700 border-green-300 hover:bg-green-100"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-semibold">Execution Plan Summary</h4>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Plan ID:</span>{' '}
                            <span className="text-gray-600">
                              {result.data?.executionPlan?.id || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>{' '}
                            <Badge variant="outline" className="ml-1">
                              {result.data?.executionPlan?.plan
                                ? 'Completed'
                                : 'Failed'}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Format:</span>{' '}
                            <span className="text-gray-600">Markdown</span>
                          </div>
                          <div>
                            <span className="font-medium">Complexity:</span>{' '}
                            <Badge variant="secondary" className="ml-1">
                              {result.data?.metadata?.planMetadata
                                ?.complexity || 'Unknown'}
                            </Badge>
                          </div>
                        </div>
                        {result.data?.executionPlan?.plan && (
                          <div className="mt-3">
                            <span className="font-medium text-sm">
                              Plan Preview:
                            </span>
                            <div className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded max-h-64 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-xs">
                                {result.data.executionPlan.plan}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">System Metadata</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {result.data?.metadata?.agentsUsed?.length || 0}{' '}
                          Agents Used
                        </Badge>
                        <Badge variant="secondary">
                          {result.data?.actStructure?.metadata
                            ?.totalComponents || 0}{' '}
                          Total Components
                        </Badge>
                        <Badge variant="secondary">
                          {result.data?.actStructure?.metadata?.complexity ||
                            'Unknown'}{' '}
                          Structure Complexity
                        </Badge>
                        {result.data?.metadata?.planMetadata
                          ?.estimatedDuration && (
                          <Badge variant="secondary">
                            ~
                            {
                              result.data.metadata.planMetadata
                                .estimatedDuration
                            }
                            s Est. Time
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    {result.data?.routePath ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold">Live Preview</h4>
                            <Badge variant="outline" className="text-xs">
                              {result.data.routePath}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsFullScreen(true)}
                              className="flex items-center gap-2"
                            >
                              <Maximize2 className="h-4 w-4" />
                              Full Screen
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const iframe = document.querySelector(
                                  '.preview-iframe'
                                ) as HTMLIFrameElement;
                                if (iframe) {
                                  iframe.src = iframe.src;
                                }
                              }}
                              className="flex items-center gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              Refresh
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(result.data?.routePath, '_blank')
                              }
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open in New Tab
                            </Button>
                          </div>
                        </div>

                        {/* Large Desktop Preview */}
                        <div className="w-full">
                          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                            <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b">
                              <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                              </div>
                              <div className="flex-1 mx-4">
                                <div className="bg-white rounded px-3 py-1 text-xs text-gray-600 font-mono">
                                  localhost:3000{result.data.routePath}
                                </div>
                              </div>
                            </div>
                            <div className="relative w-full">
                              <iframe
                                src={result.data.routePath}
                                className="preview-iframe w-full border-0"
                                style={{ height: '800px' }}
                                title="Generated Page Preview"
                                sandbox="allow-scripts allow-same-origin"
                                loading="lazy"
                                onLoad={() => setIframeLoading(false)}
                                onLoadStart={() => setIframeLoading(true)}
                              />
                              {/* Loading overlay */}
                              {iframeLoading && (
                                <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                                  <div className="flex items-center gap-3 text-gray-600">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span className="font-medium">
                                      Loading preview...
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-500 rounded-full p-1.5">
                              <Monitor className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold text-blue-900 mb-1">
                                Interactive Preview
                              </h5>
                              <p className="text-sm text-blue-700">
                                This is a live preview of your generated page.
                                All Kendo UI components are fully functional and
                                interactive.
                              </p>
                              <div className="mt-2 flex items-center gap-4 text-xs text-blue-600">
                                <span>✓ Full-size preview</span>
                                <span>✓ Interactive components</span>
                                <span>✓ Real-time updates</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h4 className="text-lg font-semibold mb-2">
                          No Preview Available
                        </h4>
                        <p className="text-sm mb-4">
                          The page generation didn't complete successfully, so
                          there's no preview to show.
                        </p>
                        {result.data?.errors && (
                          <div className="text-left max-w-md mx-auto">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                              <h5 className="font-semibold text-red-800 mb-2">
                                Generation Errors:
                              </h5>
                              {result.data.errors.actError && (
                                <div className="mb-2">
                                  <span className="font-medium text-red-700">
                                    ACT Generation:
                                  </span>
                                  <p className="text-red-600">
                                    {result.data.errors.actError}
                                  </p>
                                </div>
                              )}
                              {result.data.errors.kendoError && (
                                <div>
                                  <span className="font-medium text-red-700">
                                    Component Generation:
                                  </span>
                                  <p className="text-red-600">
                                    {result.data.errors.kendoError}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="plan" className="space-y-4">
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-semibold mb-3">
                          Execution Plan Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Plan ID:</span>{' '}
                            <code className="bg-white px-2 py-1 rounded text-xs">
                              {result.data?.executionPlan?.id || 'N/A'}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>{' '}
                            <Badge variant="outline">
                              {result.data?.executionPlan?.plan
                                ? 'Completed'
                                : 'Failed'}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Created:</span>{' '}
                            <span className="text-gray-600">
                              {result.data?.executionPlan?.createdAt
                                ? new Date(
                                    result.data.executionPlan.createdAt
                                  ).toLocaleString()
                                : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Format:</span>{' '}
                            <span className="text-gray-600">Markdown</span>
                          </div>
                        </div>
                      </div>

                      {result.data?.executionPlan?.plan && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Execution Plan</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  result.data?.executionPlan?.plan || '',
                                  'plan'
                                )
                              }
                              className="flex items-center gap-2"
                            >
                              {copiedStates.plan ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="border rounded-lg p-4 bg-white">
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                              {result.data.executionPlan.plan}
                            </pre>
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-semibold mb-2">Raw Plan Data</h4>
                        <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-64">
                          {JSON.stringify(result.data?.executionPlan, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="structure">
                    {result.data?.actStructure ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">ACT Structure</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                JSON.stringify(
                                  result.data?.actStructure || {},
                                  null,
                                  2
                                ),
                                'structure'
                              )
                            }
                            className="flex items-center gap-2"
                          >
                            {copiedStates.structure ? (
                              <>
                                <Check className="h-4 w-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-96">
                          {JSON.stringify(result.data.actStructure, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p>ACT structure generation failed</p>
                        {result.data?.errors?.actError && (
                          <p className="text-sm text-red-600 mt-2">
                            {result.data.errors.actError}
                          </p>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="code">
                    {result.data?.kendoComponents ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">Imports</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  result.data?.kendoComponents?.code?.imports?.join(
                                    '\n'
                                  ) || 'No imports',
                                  'code'
                                )
                              }
                              className="flex items-center gap-2"
                            >
                              {copiedStates.code ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                            {result.data.kendoComponents.code?.imports?.join(
                              '\n'
                            ) || 'No imports'}
                          </pre>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">Main Component</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  result.data?.kendoComponents?.code
                                    ?.mainComponent || 'No code generated',
                                  'code'
                                )
                              }
                              className="flex items-center gap-2"
                            >
                              {copiedStates.code ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-96">
                            {result.data.kendoComponents.code?.mainComponent ||
                              'No code generated'}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p>Kendo components generation failed</p>
                        {result.data?.errors?.kendoError && (
                          <p className="text-sm text-red-600 mt-2">
                            {result.data.errors.kendoError}
                          </p>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No components generated yet</p>
                  <p className="text-sm">
                    Enter a query and click Generate to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {isFullScreen && result?.data?.routePath && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="flex flex-col h-full">
            {/* Modal Header */}
            <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5" />
                <h3 className="font-semibold">Full Screen Preview</h3>
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-700 text-gray-200"
                >
                  {result.data.routePath}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const iframe = document.querySelector(
                      '.fullscreen-iframe'
                    ) as HTMLIFrameElement;
                    if (iframe) {
                      iframe.src = iframe.src;
                    }
                  }}
                  className="text-white border-gray-600 bg-gray-700 hover:bg-gray-800"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(result.data?.routePath, '_blank')}
                  className="text-white border-gray-600 bg-gray-700 hover:bg-gray-800"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullScreen(false)}
                  className="text-white border-gray-600 bg-gray-700 hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Full Screen Iframe */}
            <div className="flex-1 relative">
              <iframe
                src={result.data.routePath}
                className="fullscreen-iframe w-full h-full border-0"
                title="Full Screen Generated Page Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
