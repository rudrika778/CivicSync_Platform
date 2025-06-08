import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Settings, Users, MapPin, TrendingUp, CheckCircle, Clock, AlertTriangle, Calendar, MessageSquare, Megaphone } from 'lucide-react';
import Layout from '../components/Layout';
import { useStore, Issue } from '../store/useStore';
import { useForm } from 'react-hook-form';

interface EventForm {
  title: string;
  description: string;
  date: string;
  location: string;
  volunteerSlots: number;
  type: 'cleanup' | 'meeting' | 'awareness' | 'other';
}

interface AnnouncementForm {
  title: string;
  message: string;
}

export default function AdminDashboard() {
  const { issues, events, chatMessages, updateIssueStatus, addEvent, addChatMessage } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'events' | 'announcements'>('overview');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [chatInput, setChatInput] = useState('');

  const eventForm = useForm<EventForm>();
  const announcementForm = useForm<AnnouncementForm>();

  // Dashboard Statistics
  const stats = {
    totalIssues: issues.length,
    pendingIssues: issues.filter(i => i.status === 'pending').length,
    inProgressIssues: issues.filter(i => i.status === 'in-progress').length,
    resolvedIssues: issues.filter(i => i.status === 'resolved').length,
    totalEvents: events.length,
    totalVolunteers: events.reduce((sum, event) => sum + event.registeredVolunteers, 0)
  };

  // Chart Data
  const issueTypeData = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(issueTypeData).map(([type, count]) => ({
    type: type.length > 15 ? type.substring(0, 15) + '...' : type,
    count
  }));

  const statusData = [
    { name: 'Pending', value: stats.pendingIssues, color: '#F59E0B' },
    { name: 'In Progress', value: stats.inProgressIssues, color: '#3B82F6' },
    { name: 'Resolved', value: stats.resolvedIssues, color: '#10B981' }
  ];

  const handleStatusUpdate = (issueId: string, newStatus: Issue['status']) => {
    updateIssueStatus(issueId, newStatus, adminRemarks);
    setSelectedIssue(null);
    setAdminRemarks('');
  };

  const handleCreateEvent = (data: EventForm) => {
    addEvent(data);
    eventForm.reset();
  };

  const handleSendAnnouncement = (data: AnnouncementForm) => {
    addChatMessage({
      sender: 'City Admin',
      message: `📢 ${data.title}: ${data.message}`,
      isAdmin: true
    });
    announcementForm.reset();
  };

  const handleSendChatMessage = () => {
    if (chatInput.trim()) {
      addChatMessage({
        sender: 'City Admin',
        message: chatInput.trim(),
        isAdmin: true
      });
      setChatInput('');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage civic issues, events, and community engagement</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart },
            { key: 'issues', label: 'Issues Management', icon: MapPin },
            { key: 'events', label: 'Events', icon: Calendar },
            { key: 'announcements', label: 'Announcements', icon: Megaphone }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalIssues}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingIssues}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.inProgressIssues}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.resolvedIssues}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Events</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalEvents}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Volunteers</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.totalVolunteers}</p>
                  </div>
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Community Chat */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Community Chat</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {chatMessages.slice(-10).map(message => (
                    <div key={message.id} className={`p-3 rounded-lg ${message.isAdmin ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${message.isAdmin ? 'text-purple-700' : 'text-gray-900'}`}>
                          {message.sender}
                          {message.isAdmin && <span className="ml-1 text-xs bg-purple-200 px-2 py-0.5 rounded">Admin</span>}
                        </span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    placeholder="Type your message as admin..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendChatMessage}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Send as Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Issues Management Tab */}
        {activeTab === 'issues' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Issues Management</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {issues.map(issue => (
                <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{issue.type}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {issue.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Reported by {issue.reportedBy}</span>
                        <span>{issue.reportedAt}</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{issue.location.address}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{issue.upvotes} upvotes</span>
                        </span>
                      </div>
                      {issue.adminRemarks && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Admin Remarks:</strong> {issue.adminRemarks}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {issue.status === 'pending' && (
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Take Action
                        </button>
                      )}
                      {issue.status === 'in-progress' && (
                        <button
                          onClick={() => handleStatusUpdate(issue.id, 'resolved')}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Create New Event</h3>
              </div>
              <form onSubmit={eventForm.handleSubmit(handleCreateEvent)} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <input
                    {...eventForm.register('title', { required: true })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    {...eventForm.register('description', { required: true })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Event description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      {...eventForm.register('date', { required: true })}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      {...eventForm.register('type', { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cleanup">Clean-up</option>
                      <option value="meeting">Meeting</option>
                      <option value="awareness">Awareness</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    {...eventForm.register('location', { required: true })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Event location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volunteer Slots</label>
                  <input
                    {...eventForm.register('volunteerSlots', { required: true, min: 0 })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Number of volunteer slots"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Event
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Existing Events</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {events.map(event => (
                  <div key={event.id} className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span>{event.registeredVolunteers}/{event.volunteerSlots} volunteers</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Broadcast Announcement</h3>
            </div>
            <form onSubmit={announcementForm.handleSubmit(handleSendAnnouncement)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Announcement Title</label>
                <input
                  {...announcementForm.register('title', { required: true })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  {...announcementForm.register('message', { required: true })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter your announcement message"
                />
              </div>
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Megaphone className="w-4 h-4" />
                <span>Broadcast Announcement</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Issue Action Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Issue Status</h3>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900">{selectedIssue.type}</h4>
              <p className="text-sm text-gray-600">{selectedIssue.description}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Remarks</label>
              <textarea
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Add remarks about the issue resolution"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleStatusUpdate(selectedIssue.id, 'in-progress')}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedIssue.id, 'resolved')}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}