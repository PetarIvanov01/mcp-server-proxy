'use client';

import { useState } from 'react';
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
import { Loader2, Code, FileText, Settings, Play, Bug } from 'lucide-react';
import { ExecutionPlan } from '@/lib/types';

interface GenerationResult {
  success: boolean;
  data?: {
    originalQuery: string;
    executionPlan: ExecutionPlan;
    actStructure: any;
    kendoComponents: any;
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

      // Always set the result, even if there are errors
      console.log('data', data);
      setResult(data);

      // Only throw error if the request itself failed (not partial success)
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <strong>Plan Complexity:</strong>{' '}
                      {result.metadata?.planMetadata?.complexity || 'N/A'}
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
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
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
                              {result.data?.executionPlan?.status || 'N/A'}
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
                        {result.data?.executionPlan?.steps && (
                          <div className="mt-3">
                            <span className="font-medium text-sm">
                              Plan Preview:
                            </span>
                            <div className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded max-h-64 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-xs">
                                {result.data.executionPlan.steps}
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
                              {result.data?.executionPlan?.status || 'N/A'}
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

                      {result.data?.executionPlan?.steps && (
                        <div className="space-y-3">
                          <h4 className="font-semibold">Execution Plan</h4>
                          <div className="border rounded-lg p-4 bg-white">
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                              {result.data.executionPlan.steps}
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
                      <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-96">
                        {JSON.stringify(result.data.actStructure, null, 2)}
                      </pre>
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
                          <h4 className="font-semibold mb-2">Imports</h4>
                          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                            {result.data.kendoComponents.code?.imports?.join(
                              '\n'
                            ) || 'No imports'}
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Main Component</h4>
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
    </div>
  );
}
