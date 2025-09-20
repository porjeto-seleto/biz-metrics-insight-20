import { useState, useEffect } from "react";
import { BarChart3, LineChart, PieChart, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from "recharts";

const PredictedVsActualCard = () => {
  const [chartType, setChartType] = useState<'line' | 'pie' | 'gauge'>('line');

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

  const lineData = [
    { day: 'Seg', previsto: 40000, efetivado: 35000 },
    { day: 'Ter', previsto: 42000, efetivado: 38000 },
    { day: 'Qua', previsto: 45000, efetivado: 42000 },
    { day: 'Qui', previsto: 47000, efetivado: 45800 },
    { day: 'Sex', previsto: 50000, efetivado: 48200 },
  ];

  const pieData = [
    { name: 'Efetivado', value: 48200, color: '#10B981' },
    { name: 'Restante', value: 1800, color: '#F3F4F6' },
  ];

  const gaugePercent = (48200 / 50000) * 100;

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsLineChart data={lineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip formatter={(value: any) => `R$ ${value.toLocaleString('pt-BR')}`} />
        <Line 
          type="monotone" 
          dataKey="previsto" 
          stroke="#3B82F6" 
          strokeWidth={3}
          name="Previsto"
        />
        <Line 
          type="monotone" 
          dataKey="efetivado" 
          stroke="#10B981" 
          strokeWidth={3}
          name="Efetivado"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsPieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
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
    <div className="flex items-center justify-center h-[250px]">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#F3F4F6"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#10B981"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${(gaugePercent / 100) * 251.2} 251.2`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-success">{gaugePercent.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Efetivado</div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-bold flex items-center justify-center gap-8">
          <span className="flex items-center gap-1">
            <span className="text-primary">Previsto</span>
            <span className="text-primary font-bold">R$ 50.000</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-success">Efetivado</span>
            <span className="text-success font-bold">R$ 48.200</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <div className="flex-1">
          {chartType === 'line' && renderLineChart()}
          {chartType === 'pie' && renderPieChart()}
          {chartType === 'gauge' && renderGaugeChart()}
        </div>
        
        <div className="flex flex-col gap-2 justify-center">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
            className="flex items-center gap-1 text-xs"
          >
            <LineChart className="h-3 w-3" />
            Linha
          </Button>
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
            className="flex items-center gap-1 text-xs"
          >
            <PieChart className="h-3 w-3" />
            Pizza
          </Button>
          <Button
            variant={chartType === 'gauge' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('gauge')}
            className="flex items-center gap-1 text-xs"
          >
            <Gauge className="h-3 w-3" />
            Gauge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictedVsActualCard;