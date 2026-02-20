import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Problem } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const isSolved = problem.status === 'solved' && problem.solution;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer group hover:shadow-lg transition-all duration-300 border-l-4 hover:border-l-primary data-[solved=true]:border-l-green-500" data-solved={isSolved}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {problem.title}
              </CardTitle>
              {isSolved ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 shrink-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Solved
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 shrink-0">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2 text-sm">
              {problem.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between items-center">
            <span>{problem.createdAt ? formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true }) : 'Just now'}</span>
            <span className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View Solution <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </CardFooter>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {isSolved ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Solved</Badge>
            ) : (
              <Badge variant="outline" className="text-yellow-600 border-yellow-200">Processing</Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {problem.createdAt && new Date(problem.createdAt).toLocaleDateString()}
            </span>
          </div>
          <DialogTitle className="text-2xl">{problem.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Problem Description</h4>
            <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{problem.description}</p>
          </div>
          
          {isSolved ? (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-primary font-bold text-lg">
                <div className="p-1 bg-primary/10 rounded-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                AI Solution
              </h4>
              <div className="prose prose-sm dark:prose-invert max-w-none bg-card border rounded-lg p-6 shadow-sm">
                <p className="whitespace-pre-wrap">{problem.solution}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-muted/20 rounded-lg border border-dashed">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <Clock className="w-12 h-12 text-primary relative z-10 animate-spin-slow" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h3 className="text-lg font-medium">AI is thinking...</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                  Your problem is being analyzed. This usually takes less than a minute.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
