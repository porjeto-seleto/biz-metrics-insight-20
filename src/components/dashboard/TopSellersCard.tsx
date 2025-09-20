import { Trophy, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TopSellersCard = () => {
  const mockData = [
    { 
      position: 1, 
      name: "JOÃO SILVA", 
      team: "Equipe Alpha", 
      value: "R$ 45.850", 
      metaPercent: 115, 
      conversion: 8.5, 
      oc: 12 
    },
    { 
      position: 2, 
      name: "MARIA SANTOS", 
      team: "Equipe Beta", 
      value: "R$ 38.290", 
      metaPercent: 95, 
      conversion: 7.2, 
      oc: 10 
    },
    { 
      position: 3, 
      name: "PEDRO COSTA", 
      team: "Equipe Alpha", 
      value: "R$ 32.150", 
      metaPercent: 80, 
      conversion: 6.8, 
      oc: 8 
    },
    { 
      position: 4, 
      name: "ANA LIMA", 
      team: "Equipe Gamma", 
      value: "R$ 28.740", 
      metaPercent: 72, 
      conversion: 6.1, 
      oc: 7 
    },
    { 
      position: 5, 
      name: "CARLOS FERREIRA", 
      team: "Equipe Beta", 
      value: "R$ 25.690", 
      metaPercent: 64, 
      conversion: 5.9, 
      oc: 6 
    }
  ];

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-12 w-12 text-warning" />;
      case 2:
        return <Medal className="h-12 w-12 text-muted-foreground" />;
      case 3:
        return <Award className="h-12 w-12 text-warning" />;
      default:
        return <span className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-lg font-bold">{position}</span>;
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
      <CardContent className="space-y-8 flex-1 flex flex-col justify-between">
        {mockData.map((seller) => (
          <div 
            key={seller.position}
            className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            {/* Linha principal: Posição, Nome e Valor */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-shrink-0">
                {getPositionIcon(seller.position)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xl">{seller.name}</div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-xl text-primary">{seller.value}</div>
              </div>
            </div>
            
            {/* Linha inferior: Nº OC, % Conversão, Equipe, % Meta */}
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Nº OC</div>
                <div className="font-medium">{seller.oc}</div>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-muted-foreground">% Conversão</div>
                <div className="font-medium">{seller.conversion}%</div>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Equipe</div>
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                  {seller.team}
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-muted-foreground">% Meta</div>
                <Badge 
                  variant={seller.metaPercent >= 100 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {seller.metaPercent >= 100 ? "Meta Batida" : `${seller.metaPercent}%`}
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