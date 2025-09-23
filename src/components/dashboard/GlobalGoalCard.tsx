import { Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
        // Get current month/year in format YYYY-MM
        const currentPeriod = format(new Date(), 'yyyy-MM');
        
        const { data: goalData, error: goalError } = await supabase
          .from('global_goals')
          .select('*')
          .eq('period', currentPeriod)
          .eq('status', 'active')
          .single();

        if (goalError && goalError.code !== 'PGRST116') { // PGRST116 = no rows found
          console.error('Erro ao buscar meta global:', goalError);
          return;
        }

        if (goalData) {
          // Calculate current_value from daily reports of the current month
          const startOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
          const endOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd');
          
          const { data: reportsData, error: reportsError } = await supabase
            .from('daily_reports')
            .select('total_effective')
            .gte('report_date', startOfMonth)
            .lte('report_date', endOfMonth);

          if (reportsError) {
            console.error('Erro ao buscar relatórios:', reportsError);
            setCurrentGoal(goalData);
            return;
          }

          const totalEffective = reportsData?.reduce((sum, report) => sum + report.total_effective, 0) || 0;

          setCurrentGoal({
            ...goalData,
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
            R$ {currentGoal.target_value.toLocaleString('pt-BR')}
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
              <span className="font-bold text-success">R$ {currentGoal.current_value.toLocaleString('pt-BR')}</span>
            </div>
            <span className="text-muted-foreground">
              Faltam R$ {(currentGoal.target_value - currentGoal.current_value).toLocaleString('pt-BR')} para a meta
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalGoalCard;