import { Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrencyBR } from "@/lib/currency";

const GlobalGoalCard = () => {
  const [currentGoal, setCurrentGoal] = useState<{
    id: string;
    title: string;
    target_value: number;
    current_value: number;
    period: string;
  } | null>(null);

  useEffect(() => {
    const fetchCurrentGoal = async () => {
      try {
        // Get current month/year for filtering monthly goals
        const currentDate = new Date();
        const currentMonth = format(currentDate, 'yyyy-MM');
        
        const { data: goalData, error: goalError } = await supabase
          .from('global_goals')
          .select('*')
          .eq('status', 'active')
          .ilike('period', 'mensal:%'); // Filter for monthly goals

        if (goalError) {
          console.error('Erro ao buscar meta global:', goalError);
          return;
        }

        // Find the active monthly goal for current month
        const currentMonthGoal = goalData?.find(goal => {
          const [periodType, dateRange] = goal.period.split(':');
          if (periodType !== 'mensal') return false;
          
          const [startDateStr] = dateRange?.split('-') || [''];
          if (!startDateStr) return false;
          
          const goalMonth = format(new Date(startDateStr), 'yyyy-MM');
          return goalMonth === currentMonth;
        });

        if (currentMonthGoal) {
          // Get only the latest daily report (not sum of all reports)
          const { data: latestReport, error: reportsError } = await supabase
            .from('daily_reports')
            .select('total_effective')
            .order('report_date', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (reportsError) {
            console.error('Erro ao buscar relatório mais recente:', reportsError);
            setCurrentGoal(currentMonthGoal);
            return;
          }

          const totalEffective = latestReport?.total_effective || 0;

          setCurrentGoal({
            ...currentMonthGoal,
            current_value: totalEffective
          });
        }
      } catch (error) {
        console.error('Erro ao buscar meta global:', error);
      }
    };

    fetchCurrentGoal();
  }, []);

  // If no goal is set for current month, show fallback
  if (!currentGoal) {
    return (
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
            <Target className="h-5 w-5 text-secondary" />
            META GLOBAL
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-muted-foreground">
            Nenhuma meta definida para o mês atual
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercent = currentGoal.target_value > 0 ? (currentGoal.current_value / currentGoal.target_value) * 100 : 0;
  const visualProgressPercent = Math.min(progressPercent, 100); // Travar visualmente em 100%

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
          <Target className="h-5 w-5 text-secondary" />
          META GLOBAL
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div>
          <div className="text-lg font-medium text-muted-foreground mb-2">
            {currentGoal.title}
          </div>
          <div className="text-3xl font-bold text-secondary mb-4">
            {formatCurrencyBR(currentGoal.target_value)}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Progress 
              value={visualProgressPercent} 
              className="w-full h-10 bg-secondary/30"
            />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-sm font-bold text-white drop-shadow-lg">
                {progressPercent.toFixed(1)}%
              </span>
            </div>
            {/* Water effect animation */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/80 to-primary rounded-full overflow-hidden transition-all duration-1000 ease-out"
              style={{ width: `${visualProgressPercent}%` }}
            >
              <div className="absolute top-0 right-0 w-full h-full">
                <div className="absolute top-1/2 -right-1 w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce"></div>
                <div className="absolute top-1/3 -right-2 w-1 h-1 bg-primary-foreground/40 rounded-full animate-pulse delay-100"></div>
                <div className="absolute bottom-1/3 -right-1.5 w-1.5 h-1.5 bg-primary-foreground/50 rounded-full animate-bounce delay-200"></div>
                <div className="absolute top-2/3 -right-0.5 w-1 h-1 bg-primary-foreground/30 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
          
          {/* Informações horizontais */}
          <div className="flex items-center justify-between text-sm bg-success/10 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="font-medium text-success">Total Vendido Efetivado</span>
              <span className="font-bold text-success">{formatCurrencyBR(currentGoal.current_value)}</span>
            </div>
            <span className="text-muted-foreground">
              Faltam {formatCurrencyBR(currentGoal.target_value - currentGoal.current_value)} para a meta
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalGoalCard;