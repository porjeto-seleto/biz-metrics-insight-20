import { useState } from "react";
import { Settings, Users, Target, FileText, Upload, Edit, Trash2, CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useAdminData } from "@/hooks/useAdminData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrencyBR } from "@/lib/currency";
import { cn } from "@/lib/utils";

const PainelAdmin = () => {
  const [activeTab, setActiveTab] = useState("config");
  const {
    teams,
    sellers,
    goals,
    logs,
    config,
    loading,
    createTeam,
    updateTeam,
    deleteTeam,
    createSeller,
    updateSeller,
    deleteSeller,
    createGoal,
    updateGoal,
    deleteGoal,
    updateConfig
  } = useAdminData();

  // Form states
  const [teamForm, setTeamForm] = useState({ name: '', description: '' });
  const [sellerForm, setSellerForm] = useState({ name: '', email: '', teamId: '' });
  const [goalForm, setGoalForm] = useState({ title: '', targetValue: '', period: null as Date | null });
  const [configForm, setConfigForm] = useState({ dashboardTitle: config?.dashboard_title || '' });

  // Update config form when config loads
  useState(() => {
    if (config) {
      setConfigForm({ dashboardTitle: config.dashboard_title });
    }
  });

  // Event handlers
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return;
    
    await createTeam(teamForm.name, teamForm.description);
    setTeamForm({ name: '', description: '' });
  };

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerForm.name.trim() || !sellerForm.email.trim()) return;
    
    await createSeller(sellerForm.name, sellerForm.email, sellerForm.teamId || undefined);
    setSellerForm({ name: '', email: '', teamId: '' });
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.title.trim() || !goalForm.targetValue || !goalForm.period) return;
    
    // Format the period as YYYY-MM for the selected month
    const periodString = format(goalForm.period, 'yyyy-MM');
    await createGoal(goalForm.title, parseFloat(goalForm.targetValue), periodString);
    setGoalForm({ title: '', targetValue: '', period: null });
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configForm.dashboardTitle.trim()) return;
    
    await updateConfig({ dashboard_title: configForm.dashboardTitle });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie todas as configurações do sistema</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Equipes
            </TabsTrigger>
            <TabsTrigger value="sellers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Vendedores
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Metas Globais
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Configurações */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleUpdateConfig}>
                  <div>
                    <Label htmlFor="dashboard-title">Título do Dashboard</Label>
                    <Input 
                      id="dashboard-title"
                      placeholder="Dashboard de Vendas"
                      value={configForm.dashboardTitle}
                      onChange={(e) => setConfigForm({ dashboardTitle: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company-logo">Logo da Empresa</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="w-20 h-20 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <Button type="button" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">Salvar Configurações</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Equipes */}
          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Equipes</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTeam} className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="team-name">Nome da Equipe</Label>
                      <Input 
                        id="team-name" 
                        placeholder="Ex: Equipe Alpha"
                        value={teamForm.name}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="team-description">Descrição</Label>
                      <Input 
                        id="team-description" 
                        placeholder="Descrição da equipe"
                        value={teamForm.description}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" className="w-full">Adicionar Equipe</Button>
                    </div>
                  </div>
                </form>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Vendedores</TableHead>
                      <TableHead>Data Criação</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => {
                      const memberCount = sellers.filter(s => s.team_id === team.id).length;
                      return (
                        <TableRow key={team.id}>
                          <TableCell className="font-medium">{team.name}</TableCell>
                          <TableCell>{team.description || '-'}</TableCell>
                          <TableCell>{memberCount} vendedores</TableCell>
                          <TableCell>{format(new Date(team.created_at), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => console.log('Editar equipe:', team.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => deleteTeam(team.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {teams.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Nenhuma equipe cadastrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Vendedores */}
          <TabsContent value="sellers">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Vendedores</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSeller} className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="seller-name">Nome do Vendedor</Label>
                      <Input 
                        id="seller-name" 
                        placeholder="Ex: João Silva"
                        value={sellerForm.name}
                        onChange={(e) => setSellerForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="seller-email">Email</Label>
                      <Input 
                        id="seller-email" 
                        type="email"
                        placeholder="joao@empresa.com"
                        value={sellerForm.email}
                        onChange={(e) => setSellerForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="seller-team">Equipe</Label>
                      <Select 
                        value={sellerForm.teamId}
                        onValueChange={(value) => setSellerForm(prev => ({ ...prev, teamId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" className="w-full">Adicionar Vendedor</Button>
                    </div>
                  </div>
                </form>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Equipe</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Criação</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellers.map((seller) => (
                      <TableRow key={seller.id}>
                        <TableCell className="font-medium">{seller.name}</TableCell>
                        <TableCell>{seller.email}</TableCell>
                        <TableCell>{seller.teams?.name || 'Sem equipe'}</TableCell>
                        <TableCell>
                          <Badge variant={seller.status === "active" ? "default" : "secondary"}>
                            {seller.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(seller.created_at), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateSeller(seller.id, { 
                                status: seller.status === 'active' ? 'inactive' : 'active' 
                              })}
                            >
                              {seller.status === 'active' ? 'Desativar' : 'Ativar'}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteSeller(seller.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sellers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Nenhum vendedor cadastrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Metas Globais */}
          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Metas Globais</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateGoal} className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="goal-name">Nome da Meta</Label>
                      <Input 
                        id="goal-name" 
                        placeholder="Ex: Meta Q4 2024"
                        value={goalForm.title}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-period">Período (Mês/Ano)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !goalForm.period && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {goalForm.period ? format(goalForm.period, "MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecionar mês</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={goalForm.period}
                            onSelect={(date) => setGoalForm(prev => ({ ...prev, period: date }))}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="goal-value">Valor Alvo (R$)</Label>
                      <CurrencyInput 
                        id="goal-value" 
                        value={goalForm.targetValue}
                        onChange={(value) => setGoalForm(prev => ({ ...prev, targetValue: value.toString() }))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" className="w-full">Adicionar Meta</Button>
                    </div>
                  </div>
                </form>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Valor Alvo</TableHead>
                      <TableHead>Valor Atual</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goals.map((goal) => (
                      <TableRow key={goal.id}>
                        <TableCell className="font-medium">{goal.title}</TableCell>
                        <TableCell>{goal.period}</TableCell>
                        <TableCell>{formatCurrencyBR(goal.target_value)}</TableCell>
                        <TableCell>{formatCurrencyBR(goal.current_value)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            goal.status === 'active' ? 'default' : 
                            goal.status === 'completed' ? 'secondary' : 'outline'
                          }>
                            {goal.status === 'active' ? 'Ativa' : 
                             goal.status === 'completed' ? 'Concluída' : 'Pausada'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => console.log('Editar meta:', goal.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteGoal(goal.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {goals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Nenhuma meta cadastrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: Logs */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Auditoria</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </TableCell>
                        <TableCell>{log.user_email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.description}</TableCell>
                      </TableRow>
                    ))}
                    {logs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          Nenhum log disponível
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PainelAdmin;