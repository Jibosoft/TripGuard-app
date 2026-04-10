import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  LogOut, 
  User,
  Plane,
  BookOpen,
  CheckCircle,
  Plus,
  Loader2,
  Shield,
  ChevronRight
} from 'lucide-react';

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    profile: {
      nationality: string;
      language: string;
      emergencyContact: string;
    };
    createdAt: string;
  };
  stats: {
    totalTrips: number;
    totalBookings: number;
    upcomingTrips: number;
    completedTrips: number;
  };
  recentTrips: any[];
  recentBookings: any[];
}

export function UserDashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/user/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-teal-500" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600">Failed to load dashboard data.</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { stats, recentTrips } = dashboardData;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">TripGuard</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'trips', label: 'My Trips', icon: Plane },
                    { id: 'bookings', label: 'Bookings', icon: BookOpen },
                    { id: 'profile', label: 'Profile', icon: User },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Trips</span>
                  <Badge variant="secondary">{stats.totalTrips}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Upcoming</span>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                    {stats.upcomingTrips}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Completed</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {stats.completedTrips}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
                  <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                  <p className="text-teal-100">
                    Ready to plan your next adventure? You have {stats.upcomingTrips} upcoming trip{stats.upcomingTrips !== 1 ? 's' : ''}.
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Trips', value: stats.totalTrips, icon: Plane, color: 'bg-blue-100 text-blue-600' },
                    { label: 'Bookings', value: stats.totalBookings, icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
                    { label: 'Upcoming', value: stats.upcomingTrips, icon: Calendar, color: 'bg-teal-100 text-teal-600' },
                    { label: 'Completed', value: stats.completedTrips, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
                  ].map((stat, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Trips */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Trips</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('trips')}>
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {recentTrips.length === 0 ? (
                      <div className="text-center py-8">
                        <Plane className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No trips yet. Start planning your first adventure!</p>
                        <Button className="mt-4 gradient-teal text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Plan a Trip
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentTrips.map((trip) => (
                          <div
                            key={trip.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-teal-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{trip.name}</p>
                                <p className="text-sm text-slate-500">{trip.destination}</p>
                              </div>
                            </div>
                            <Badge variant={trip.status === 'planned' ? 'outline' : 'secondary'}>
                              {trip.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'trips' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Trips</CardTitle>
                  <Button className="gradient-teal text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Trip
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentTrips.length === 0 ? (
                    <div className="text-center py-12">
                      <Plane className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No trips yet</h3>
                      <p className="text-slate-500 mb-4">Start planning your adventure with TripGuard</p>
                      <Button className="gradient-teal text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Trip
                      </Button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {recentTrips.map((trip) => (
                        <Card key={trip.id} className="border-2 hover:border-teal-200 transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-white" />
                              </div>
                              <Badge variant={trip.status === 'planned' ? 'outline' : 'secondary'}>
                                {trip.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-1">{trip.name}</h3>
                            <p className="text-sm text-slate-500 mb-3">{trip.destination}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(trip.startDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {trip.type}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'bookings' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings yet</h3>
                    <p className="text-slate-500 mb-4">Book verified guides and services for your trips</p>
                    <Button className="gradient-coral text-white">
                      Browse Guides
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl">
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{user?.name}</h3>
                      <p className="text-slate-500">{user?.email}</p>
                      <Badge variant="outline" className="mt-2">Traveler</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="mt-1 w-full px-3 py-2 border rounded-lg bg-slate-50"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Nationality</label>
                        <input
                          type="text"
                          placeholder="e.g., United States"
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Language</label>
                        <input
                          type="text"
                          placeholder="e.g., English"
                          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">Emergency Contact</label>
                      <input
                        type="text"
                        placeholder="Name and phone number"
                        className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    <div className="pt-4">
                      <Button className="gradient-teal text-white">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
