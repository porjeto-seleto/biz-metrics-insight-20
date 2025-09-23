import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Trophy, Target, TrendingUp, BarChart3, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import TopSellersCard from "@/components/dashboard/TopSellersCard";
import GlobalGoalCard from "@/components/dashboard/GlobalGoalCard";
import CashFlowCard from "@/components/dashboard/CashFlowCard";
import PredictedVsActualCard from "@/components/dashboard/PredictedVsActualCard";
import ProfitMarginCard from "@/components/dashboard/ProfitMarginCard";

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <DashboardHeader 
        currentDate={currentDate} 
        onNavigateDate={navigateDate}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      
      {/* Main Dashboard Grid */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full max-w-[1920px] mx-auto">
          {/* Column 1 - Top 5 Vendedores */}
          <TopSellersCard currentDate={currentDate} />
          
          {/* Column 2 - Meta Global and Fluxo de Caixa */}
          <div className="grid gap-4 h-full" style={{ gridTemplateRows: '0.6fr 1fr' }}>
            <GlobalGoalCard />
            <CashFlowCard currentDate={currentDate} />
          </div>
          
          {/* Column 3 - Dash Previsto and Margem de Lucro */}
          <div className="grid gap-4 h-full" style={{ gridTemplateRows: '0.6fr 1fr' }}>
            <PredictedVsActualCard />
            <ProfitMarginCard currentDate={currentDate} />
          </div>
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;