import React, { useState } from 'react';
import { Plus, MapPin, ThumbsUp, MessageSquare, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import IssueReportModal from '../components/IssueReportModal';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';

export default function CitizenDashboard() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my-issues' | 'upvoted'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');
  
  const { issues, events, chatMessages, upvoteIssue, addChatMessage } = useStore();
  const { user } = useAuth();
  const [chatInput, setChatInput] = useState('');

  const filteredIssues = issues.filter(issue => {
    const statusMatch = filterStatus === 'all' || issue.status === filterStatus;
    const tabMatch = activeTab === 'all' || 
                    (activeTab === 'my-issues' && issue.reportedBy === user?.name) ||
                    (activeTab === 'upvoted' && issue.hasUpvoted);
    return statusMatch && tabMatch;
  });

  const handleUpvote = (issueId: string) => {
    upvoteIssue(issueId);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      addChatMessage({
        sender: user?.name || 'Anonymous',
        message: chatInput.trim()
      });
      setChatInput('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <TrendingUp className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: issues.length,
    myIssues: issues.filter(i => i.reportedBy === user?.name).length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    upcomingEvents: events.length
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Citizen Dashboard</h1>
            <p className="text-gray-600">Report issues, track progress, and engage with your community</p>
          </div>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Report Issue</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.myIssues}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Issues Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Issues</h2>
                
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
                  {[
                    { key: 'all', label: 'All Issues' },
                    { key: 'my-issues', label: 'My Reports' },
                    { key: 'upvoted', label: 'Upvoted' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {filteredIssues.map(issue => (
                  <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{issue.type}</h3>
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                            {getStatusIcon(issue.status)}
                            <span className="capitalize">{issue.status.replace('-', ' ')}</span>
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{issue.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>By {issue.reportedBy}</span>
                          <span>{issue.reportedAt}</span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{issue.location.address}</span>
                          </span>
                        </div>
                        {issue.adminRemarks && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700">
                              <strong>Admin:</strong> {issue.adminRemarks}
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleUpvote(issue.id)}
                        disabled={issue.hasUpvoted}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                          issue.hasUpvoted
                            ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{issue.upvotes}</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {filteredIssues.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No issues found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Chat */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Community Chat</span>
                </h3>
              </div>
              <div className="p-4">
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {chatMessages.map(message => (
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Upcoming Events</span>
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {events.slice(0, 3).map(event => (
                  <div key={event.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span>{event.registeredVolunteers}/{event.volunteerSlots || 'Open'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <IssueReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </Layout>
  );
}