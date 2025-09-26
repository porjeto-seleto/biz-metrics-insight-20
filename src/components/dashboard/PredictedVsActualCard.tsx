import { useState, useEffect } from "react";
import { BarChart3, LineChart, PieChart, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { format, getDaysInMonth, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

const PredictedVsActualCard = () => {
  const [chartType, setChartType] = useState<'line' | 'pie' | 'gauge'>('line');
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalPredicted, setTotalPredicted] = useState(0);
  const [totalActual, setTotalActual] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentDate = new Date();
        const currentPeriod = format(currentDate, 'yyyy-MM');
        const daysInMonth = getDaysInMonth(currentDate);
        const currentDay = currentDate.getDate();

        // Buscar meta global do mês atual
        const { data: goalData, error: goalError } = await supabase
          .from('global_goals')
          .select('target_value')
          .eq('period', currentPeriod)
          .eq('status', 'active')
          .maybeSingle();

        if (goalError) {
          console.error('Erro ao buscar meta global:', goalError);
          return;
        }

        const monthlyGoal = goalData?.target_value || 0;
        const dailyGoal = monthlyGoal / daysInMonth;

        // Buscar todos os relatórios do mês atual
        const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

        const { data: reportsData, error: reportsError } = await supabase
          .from('daily_reports')
          .select('report_date, total_effective')
          .gte('report_date', startDate)
          .lte('report_date', endDate)
          .order('report_date');

        if (reportsError) {
          console.error('Erro ao buscar relatórios:', reportsError);
          return;
        }

        // Criar array com dados do mês completo
        const monthData = [];
        let cumulativeActual = 0;

        for (let day = 1; day <= daysInMonth; day++) {
          const dayDate = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd');
          const dayReport = reportsData?.find(report => report.report_date === dayDate);
          
          if (dayReport) {
            cumulativeActual = dayReport.total_effective;
          }

          const cumulativePredicted = dailyGoal * day;

          monthData.push({
            day: day,
            previsto: Math.round(cumulativePredicted),
            efetivado: day <= currentDay ? Math.round(cumulativeActual) : null
          });
        }

        setChartData(monthData);
        setTotalPredicted(Math.round(dailyGoal * currentDay));
        setTotalActual(Math.round(cumulativeActual));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-rotate charts every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setChartType(current => {
        if (current === 'line') return 'pie';
        if (current === 'pie') return 'gauge';
        return 'line';
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { name: 'Efetivado', value: totalActual, color: '#10B981' },
    { name: 'Restante', value: Math.max(0, totalPredicted - totalActual), color: '#F3F4F6' },
  ];

  const gaugePercent = totalPredicted > 0 ? (totalActual / totalPredicted) * 100 : 0;

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={180}>
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="day" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value: any) => value ? `R$ ${value.toLocaleString('pt-BR')}` : 'N/A'}
          labelFormatter={(label) => `Dia ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="previsto" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={false}
          name="Previsto"
        />
        <Line 
          type="monotone" 
          dataKey="efetivado" 
          stroke="#10B981" 
          strokeWidth={2}
          dot={false}
          connectNulls={false}
          name="Efetivado"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={180}>
      <RechartsPieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => `R$ ${value.toLocaleString('pt-BR')}`} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );

  const renderGaugeChart = () => (
    <div className="flex items-center justify-center h-[180px]">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#F3F4F6"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#10B981"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${(Math.min(gaugePercent, 100) / 100) * 219.8} 219.8`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xl font-bold text-success">{gaugePercent.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Efetivado</div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            PREVISTO VS EFETIVADO
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          PREVISTO VS EFETIVADO
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Previsto</div>
            <div className="text-2xl font-bold text-primary">R$ {totalPredicted.toLocaleString('pt-BR')}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Efetivado</div>
            <div className="text-2xl font-bold text-success">R$ {totalActual.toLocaleString('pt-BR')}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Botões verticais à esquerda */}
          <div className="flex flex-col gap-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className="p-2 min-w-0"
            >
              <LineChart className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
              className="p-2 min-w-0"
            >
              <PieChart className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'gauge' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('gauge')}
              className="p-2 min-w-0"
            >
              <Gauge className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Área do gráfico */}
          <div className="flex-1">
            <div className="min-h-[180px]">
              {chartType === 'line' && renderLineChart()}
              {chartType === 'pie' && renderPieChart()}
              {chartType === 'gauge' && renderGaugeChart()}
            </div>
            
            {/* Legendas na parte inferior */}
            {(chartType === 'line' || chartType === 'pie') && (
              <div className="flex items-center justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span className="text-xs text-muted-foreground">Previsto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">Efetivado</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictedVsActualCard;