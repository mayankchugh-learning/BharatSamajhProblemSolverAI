import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Problem, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, MessageSquare, Globe } from "lucide-react";
import { useLocation } from "wouter";

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const [, navigate] = useLocation();
  const isSolved = problem.status === 'solved' && problem.solution;
  const langKey = (problem.language || "english") as SupportedLanguage;
  const langInfo = SUPPORTED_LANGUAGES[langKey];

  return (
    <Card
      className="cursor-pointer group hover:shadow-lg transition-all duration-300 border-l-4 hover:border-l-primary data-[solved=true]:border-l-green-500"
      data-solved={isSolved}
      onClick={() => navigate(`/problems/${problem.id}`)}
    >
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
        <div className="flex items-center gap-2">
          <span>{problem.createdAt ? formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true }) : 'Just now'}</span>
          {langKey !== "english" && langInfo && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
              <Globe className="w-2.5 h-2.5 mr-0.5" />
              {langInfo.nativeLabel}
            </Badge>
          )}
        </div>
        <span className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <MessageSquare className="w-3.5 h-3.5 mr-1" />
          Discuss
        </span>
      </CardFooter>
    </Card>
  );
}
