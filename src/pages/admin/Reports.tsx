import { useEffect, useState } from 'react';
import { reportAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/AdminLayout';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { Loader2, MessageSquare } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AdminReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getAll();
      setReports(response.data.reports);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, status: string) => {
    try {
      await reportAPI.updateStatus(reportId, { status });
      toast.success('Status updated');
      fetchReports();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleResponse = async () => {
    if (!selectedReport || !response) return;
    try {
      await reportAPI.addAdminResponse(selectedReport._id, { message: response });
      toast.success('Response added');
      setResponseDialogOpen(false);
      setResponse('');
      fetchReports();
    } catch (error) {
      toast.error('Failed to add response');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return styles[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <AdminPageHeader title="Report Management" subtitle="Handle user reports and issues" />
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : reports.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No reports yet"
                description="User-submitted reports will appear here for triage."
              />
            ) : (
              <div className="space-y-6">
                {reports.map((report) => (
                  <div key={report._id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusBadge(report.status)}>{report.status}</Badge>
                          <Badge className={getPriorityBadge(report.priority)}>{report.priority}</Badge>
                          <Badge variant="outline">{report.type}</Badge>
                        </div>
                        <h4 className="font-semibold">{report.subject}</h4>
                        <p className="text-sm text-gray-500">Report ID: {report.reportId}</p>
                      </div>
                      <Select 
                        value={report.status} 
                        onValueChange={(value) => handleStatusChange(report._id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-600">{report.description}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      <span>By: {report.user?.firstName} {report.user?.lastName}</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                    {report.responses?.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {report.responses.map((resp: any, idx: number) => (
                          <div key={idx} className={`p-3 rounded-lg ${resp.from === 'admin' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                            <p className="text-sm font-medium">{resp.from === 'admin' ? 'Admin' : 'User'} Response:</p>
                            <p className="text-sm mt-1">{resp.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          setResponseDialogOpen(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Respond
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Response</DialogTitle>
            <DialogDescription>Respond to this report</DialogDescription>
          </DialogHeader>
          <textarea
            className="w-full p-3 border rounded-lg resize-none"
            rows={4}
            placeholder="Enter your response..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResponse} disabled={!response}>Send Response</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminReports;
