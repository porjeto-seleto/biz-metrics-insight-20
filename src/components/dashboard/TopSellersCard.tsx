import { Trophy, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDailyReports } from "@/hooks/useDailyReports";
import { useSellers } from "@/hooks/useSellers";
import { useEffect } from "react";

interface TopSellersCardProps {
  currentDate?: Date;
}

const TopSellersCard = ({ currentDate = new Date() }: TopSellersCardProps) => {
  const { getReportByDate, getRankingsByType } = useDailyReports();
  const { sellers } = useSellers();
  
  useEffect(() => {
    const dateStr = currentDate.toISOString().split('T')[0];
    getReportByDate(dateStr);
  }, [currentDate]);

  const topSellersData = getRankingsByType('top_sellers');
  
  const sellersWithNames = topSellersData.map(ranking => {
    const seller = sellers.find(s => s.id === ranking.seller_id);
    return {
      position: ranking.position,
      name: seller?.name || 'Vendedor não encontrado',
      team: seller?.team?.name || 'Sem equipe',
      value: ranking.value_sold,
      conversion: ranking.conversion_rate,
      oc: ranking.oc_number || 'N/A'
    };
  });

  // Fill empty positions if less than 5
  const displayData = Array(5).fill(null).map((_, index) => {
    const existing = sellersWithNames.find(s => s.position === index + 1);
    return existing || {
      position: index + 1,
      name: 'Sem dados',
      team: 'Sem equipe',
      value: 0,
      conversion: 0,
      oc: 'N/A'
    };
  });

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-8 w-8 text-warning" />;
      case 2:
        return <Medal className="h-8 w-8 text-muted-foreground" />;
      case 3:
        return <Award className="h-8 w-8 text-warning" />;
      default:
        return <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">{position}</span>;
    }
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          TOP 5 VENDEDORES
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 flex-1 flex flex-col justify-between">
        {displayData.map((seller) => (
          <div 
            key={seller.position}
            className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            {/* Linha principal: Posição, Nome e Valor */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-shrink-0">
                {getPositionIcon(seller.position)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{seller.name}</div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-sm text-primary">
                  {seller.value > 0 ? `R$ ${seller.value.toLocaleString('pt-BR')}` : 'R$ 0'}
                </div>
              </div>
            </div>
            
            {/* Linha inferior: Nº OC, % Conversão, Equipe */}
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Nº OC</div>
                <div className="font-medium text-xs">{seller.oc}</div>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-muted-foreground">% Conversão</div>
                <div className="font-medium text-xs">{seller.conversion}%</div>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Equipe</div>
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground px-1 py-0">
                  {seller.team}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopSellersCard;