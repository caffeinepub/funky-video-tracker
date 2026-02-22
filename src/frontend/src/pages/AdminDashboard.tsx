import { useUserRole } from '../hooks/useUserRole';
import { useGetAdminDashboard } from '../hooks/useQueries';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import EngagementTable from '../components/EngagementTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminDashboard() {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { data: dashboardData, isLoading: dataLoading, error } = useGetAdminDashboard();

  if (roleLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
        <Loader2 className="h-16 w-16 animate-spin text-chart-1" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      {/* Background Header Image */}
      <div
        className="absolute top-0 left-0 right-0 h-48 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/admin-header.dim_1000x300.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-chart-2 via-chart-4 to-chart-1 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Track user engagement and video performance</p>
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 mx-auto animate-spin text-chart-2" />
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>Failed to load dashboard data. Please try again later.</AlertDescription>
          </Alert>
        ) : !dashboardData ? (
          <div className="text-center py-16 space-y-4">
            <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">No Data Available</h2>
            <p className="text-muted-foreground">Start adding videos to see engagement data</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Total Videos</CardTitle>
                  <CardDescription>Videos shared with the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-chart-1">{dashboardData.videos.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Engagements</CardTitle>
                  <CardDescription>User interactions recorded</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-chart-4">{dashboardData.records.length}</p>
                </CardContent>
              </Card>
            </div>

            <EngagementTable videos={dashboardData.videos} records={dashboardData.records} />
          </div>
        )}
      </div>
    </div>
  );
}
