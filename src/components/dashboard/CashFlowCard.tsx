import { DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CashFlowCard = () => {
  const mockData = [
    { 
      position: 1, 
      name: "JOÃO SILVA", 
      sold: 45850, 
      received: 41265,
      effectiveness: 90 
    },
    { 
      position: 2, 
      name: "MARIA SANTOS", 
      sold: 38290, 
      received: 32046,
      effectiveness: 84 
    },
    { 
      position: 3, 
      name: "PEDRO COSTA", 
      sold: 32150, 
      received: 25720,
      effectiveness: 80 
    },
    { 
      position: 4, 
      name: "ANA LIMA", 
      sold: 28740, 
      received: 20118,
      effectiveness: 70 
    },
    { 
      position: 5, 
      name: "CARLOS FERREIRA", 
      sold: 25690, 
      received: 17983,
      effectiveness: 70 
    }
  ];

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
          <DollarSign className="h-5 w-5 text-success" />
          FLUXO DE CAIXA TOP 5
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockData.map((seller) => (
          <div 
            key={seller.position}
            className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="grid grid-cols-4 gap-3 items-start">
              {/* Colocação */}
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 text-success font-bold text-sm">
                  {seller.position}
                </div>
              </div>
              
              {/* Vendedor */}
              <div className="min-w-0">
                <div className="font-semibold text-sm">{seller.name}</div>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success border border-success/30">
                    {seller.effectiveness}% Efetivado
                  </span>
                </div>
              </div>
              
              {/* Vendido */}
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Vendido</div>
                <div className="font-bold text-sm">R$ {seller.sold.toLocaleString('pt-BR')}</div>
              </div>
              
              {/* Recebido */}
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Recebido</div>
                <div className="font-bold text-sm text-success">R$ {seller.received.toLocaleString('pt-BR')}</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CashFlowCard;