import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
  } from "recharts";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { View, Users, MessageSquare, BarChart } from "lucide-react";
  
  interface AnalyticsSectionProps {
    startup: any; // Replace with proper type
  }
  
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];
  
  export function AnalyticsSection({ startup }: AnalyticsSectionProps) {
    // Process analytics data
    const stats = [
      {
        title: "Profile Views",
        value: startup.analytics?.profileViews || 0,
        icon: View,
        change: "+12%"
      },
      {
        title: "Job Applications",
        value: startup.analytics?.jobApplications || 0,
        icon: Users,
        change: "+5%"
      },
      {
        title: "Contact Inquiries",
        value: startup.analytics?.inquiries || 0,
        icon: MessageSquare,
        change: "+8%"
      },
      {
        title: "Total Interactions",
        value: startup.analytics?.totalInteractions || 0,
        icon: BarChart,
        change: "+15%"
      }
    ];
  
    // Sample view data - replace with actual data processing
    const viewData = startup.analytics?.viewsByDate?.map((view: any) => ({
      date: new Date(view.date).toLocaleDateString(),
      views: view.count
    })) || [];
  
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
  
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="hsl(var(--primary))" 
                      name="Views" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={startup.analytics?.trafficSources || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {(startup.analytics?.trafficSources || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }