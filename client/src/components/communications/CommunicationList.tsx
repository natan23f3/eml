import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, PhoneCall, Search, Info, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Communication } from "@/types/schema";

interface CommunicationListProps {
  communications: Communication[] | any[];
  isLoading?: boolean;
  showFilters?: boolean;
}

export function CommunicationList({ communications = [], isLoading = false, showFilters = false }: CommunicationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Format date
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  // Get icon by type
  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'sms':
        return <MessageSquare className="w-5 h-5" />;
      case 'call':
        return <PhoneCall className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800">Enviado</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pendente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get color class by type
  const getColorClass = (type: string): string => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-700';
      case 'sms':
        return 'bg-green-100 text-green-700';
      case 'call':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get type label
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'email':
        return 'Email';
      case 'sms':
        return 'SMS';
      case 'call':
        return 'Ligação';
      default:
        return type;
    }
  };

  // Filter communications based on search term, status, and type
  const filteredCommunications = communications.filter(comm => {
    // Text search filter
    const matchesSearch = 
      (comm.subject && comm.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (comm.content && comm.content.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === 'all' || (comm.status === statusFilter);

    // Type filter
    const matchesType = typeFilter === 'all' || (comm.type === typeFilter);

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Histórico de Comunicações</CardTitle>
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar comunicações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Filtros:</span>
              </div>
              
              <div className="grid grid-cols-2 sm:flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="call">Ligações</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="sent">Enviados</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="failed">Falhou</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTypeFilter('all');
                    setStatusFilter('all');
                    setSearchTerm('');
                  }}
                  className="text-xs"
                >
                  Limpar filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCommunications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Mail className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <h3 className="text-lg font-medium mb-1">Nenhuma comunicação encontrada</h3>
            <p className="text-sm">Use os botões acima para registrar uma nova comunicação.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCommunications.map((comm) => (
              <div key={comm.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClass(comm.type)}`}>
                      {getCommunicationIcon(comm.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {comm.subject || getTypeLabel(comm.type)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {comm.studentId 
                          ? `Aluno ID: ${comm.studentId}` 
                          : 'Comunicação geral'
                        }
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(comm.status)}
                </div>
                
                <div className="pl-13 space-y-2">
                  <div className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">
                    {comm.content}
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {formatDate(comm.sentDate.toString())}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}