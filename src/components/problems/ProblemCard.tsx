
import React from 'react';
import { motion } from 'framer-motion';
import { Code, Star, CheckCircle, ExternalLink, ArrowLeft, BookOpen, Copy, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

interface ProblemCardProps {
  problem: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    topics: string[];
    constraints: string[];
    examples: {
      input: string;
      output: string;
      explanation?: string;
    }[];
    solution?: string;
    hints?: string[];
  };
  onBack?: () => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-500/20 text-green-500';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'hard':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-blue-500/20 text-blue-500';
  }
};

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onBack }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      {/* Problem Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4 mb-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">{problem.title}</h1>
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {problem.topics.map((topic) => (
                <Badge key={topic} variant="outline">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Star className="h-5 w-5 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to Favorites</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to Problem Set</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open in Original Platform</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Problem Content */}
      <Tabs defaultValue="description" className="p-6">
        <TabsList className="mb-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="solution">Solution</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <div className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <p>{problem.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Constraints:</h3>
              <ul className="list-disc pl-6 space-y-1">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="text-gray-300">{constraint}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Examples:</h3>
              <div className="space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">Example {index + 1}:</h4>
                    <div className="bg-gray-800 p-4 rounded-lg relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-400">Input:</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(example.input)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <pre className="text-sm">{example.input}</pre>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-400">Output:</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(example.output)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <pre className="text-sm">{example.output}</pre>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="text-sm font-medium text-gray-400">Explanation:</span>
                        <p className="text-sm mt-1">{example.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="solution">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Solutions will be available after you solve the problem or purchase premium access.</p>
              <Button variant="outline" className="mt-4">Upgrade to Premium</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Code className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">You haven't made any submissions for this problem yet.</p>
              <Button className="mt-4">Solve Now</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discussion">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Code className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Discussion board is coming soon!</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Problem Footer */}
      <div className="p-6 border-t border-gray-800 flex justify-between">
        <Button variant="outline">Previous Problem</Button>
        <Button>Solve Problem</Button>
        <Button variant="outline">Next Problem</Button>
      </div>
    </motion.div>
  );
};

export default ProblemCard;
