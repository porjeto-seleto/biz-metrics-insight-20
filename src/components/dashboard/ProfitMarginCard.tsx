import { Percent, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProfitMarginCard = () => {
  const mockData = [
    { 
      position: 1, 
      name: "JOÃO SILVA", 
      margin: 22.5 
    },
    { 
      position: 2, 
      name: "MARIA SANTOS", 
      margin: 19.8 
    },
    { 
      position: 3, 
      name: "PEDRO COSTA", 
      margin: 18.2 
    },
    { 
      position: 4, 
      name: "ANA LIMA", 
      margin: 16.7 
    },
    { 
      position: 5, 
      name: "CARLOS FERREIRA", 
      margin: 15.3 
    }
  ];

  const getMarginColor = (margin: number) => {
    if (margin >= 20) return "text-success";
    if (margin >= 15) return "text-warning";
    return "text-destructive";
  };

  const getMarginBadgeVariant = (margin: number) => {
    if (margin >= 20) return "default";
    if (margin >= 15) return "secondary";
    return "destructive";
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
          <Percent className="h-5 w-5 text-warning" />
          MARGEM DE LUCRO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockData.map((seller) => (
          <div 
            key={seller.position}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning/20 text-warning font-bold text-sm">
              {seller.position}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{seller.name}</div>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold ${getMarginColor(seller.margin)} mb-1`}>
                {seller.margin}%
              </div>
              <Badge 
                variant={getMarginBadgeVariant(seller.margin)}
                className="text-xs flex items-center gap-1"
              >
                <TrendingUp className="h-3 w-3" />
                Margem de Lucro
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProfitMarginCard;