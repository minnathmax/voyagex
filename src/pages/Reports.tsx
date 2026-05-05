import { useEffect, useState } from 'react';
import { reportAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MessageSquare, Plus, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Reports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    type: '',
    category: '',
    subject: '',
    description: '',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getMyReports();
      setReports(response.data.reports);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newReport.type || !newReport.subject || !newReport.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await reportAPI.create(newReport);
      toast.success('Report submitted successfully');
      setCreateDialogOpen(false);
      setNewReport({ type: '', category: '', subject: '', description: '' });
      fetchReports();
    } catch (error) {
      toast.error('Failed to submit report');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Reports</h1>
            <p className="text-gray-600">Submit and track your support requests</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Report
          </Button>
        </div>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No reports yet</h3>
              <p className="text-gray-500 mb-4">Submit a report if you need assistance</p>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Report
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusBadge(report.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(report.status)}
                            {report.status}
                          </span>
                        </Badge>
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                      <h3 className="font-semibold">{report.subject}</h3>
                      <p className="text-sm text-gray-500">Report ID: {report.reportId}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-3">{report.description}</p>
                  {report.responses?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {report.responses.map((resp: any, idx: number) => (
                        <div key={idx} className={`p-3 rounded-lg ${resp.from === 'admin' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                          <p className="text-sm font-medium">{resp.from === 'admin' ? 'Admin' : 'You'}:</p>
                          <p className="text-sm mt-1">{resp.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>Submit a new support request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Type</Label>
              <Select 
                value={newReport.type} 
                onValueChange={(value) => setNewReport(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booking">Booking Issue</SelectItem>
                  <SelectItem value="payment">Payment Issue</SelectItem>
                  <SelectItem value="destination">Destination Issue</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                className="mt-2"
                placeholder="Brief summary of the issue"
                value={newReport.subject}
                onChange={(e) => setNewReport(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                className="w-full mt-2 p-3 border rounded-lg resize-none"
                rows={4}
                placeholder="Detailed description of the issue..."
                value={newReport.description}
                onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
