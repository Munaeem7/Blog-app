// src/components/Admin/ContactSubmissions.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail, 
  FiUser, 
  FiCalendar, 
  FiMessageSquare, 
  FiEye, 
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import { contactAPI } from '../../Api/Api';

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');

  // Fetch submissions from API
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await contactAPI.getAll(1, 50, statusFilter === 'all' ? '' : statusFilter);
      
      if (response.data.success) {
        setSubmissions(response.data.data);
      } else {
        setError('Failed to load submissions');
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'read':
        return <FiEye className="text-blue-500" />;
      case 'replied':
        return <FiCheckCircle className="text-green-500" />;
      case 'archived':
        return <FiMail className="text-gray-500" />;
      default:
        return <FiMail className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      setActionLoading(true);
      const response = await contactAPI.updateStatus(id, 'read');
      
      if (response.data.success) {
        setSubmissions(prev => prev.map(sub => 
          sub.id === id ? { ...sub, status: 'read' } : sub
        ));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(prev => ({ ...prev, status: 'read' }));
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsReplied = async (id) => {
    try {
      setActionLoading(true);
      const response = await contactAPI.updateStatus(id, 'replied');
      
      if (response.data.success) {
        setSubmissions(prev => prev.map(sub => 
          sub.id === id ? { ...sub, status: 'replied' } : sub
        ));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(prev => ({ ...prev, status: 'replied' }));
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async (id) => {
    try {
      setActionLoading(true);
      const response = await contactAPI.updateStatus(id, 'archived');
      
      if (response.data.success) {
        setSubmissions(prev => prev.map(sub => 
          sub.id === id ? { ...sub, status: 'archived' } : sub
        ));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(prev => ({ ...prev, status: 'archived' }));
        }
      }
    } catch (err) {
      console.error('Error archiving submission:', err);
      alert('Failed to archive submission');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await contactAPI.delete(id);
      
      if (response.data.success) {
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
      alert('Failed to delete submission');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchSubmissions();
    setSelectedSubmission(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Submission List */}
      <div className="lg:col-span-1 space-y-4">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Messages</h3>
            <button
              onClick={handleRefresh}
              disabled={actionLoading}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <FiRefreshCw className={`h-4 w-4 ${actionLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Messages List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiMail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>No messages found</p>
              {searchTerm && (
                <p className="text-sm mt-2">Try changing your search terms</p>
              )}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {filteredSubmissions.map((submission) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                    selectedSubmission?.id === submission.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-gray-50'
                  } ${submission.status === 'pending' ? 'border-l-4 border-l-yellow-400' : ''}`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          submission.status === 'pending' ? 'bg-red-500' : 'bg-transparent'
                        }`} />
                        <h3 className="font-medium text-gray-900 truncate">
                          {submission.name}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-1 truncate">
                      {submission.subject}
                    </p>
                    <p className="text-sm text-gray-500 truncate mb-2">
                      {submission.message.substring(0, 60)}...
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="h-3 w-3" />
                        <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(submission.status)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2">
        {selectedSubmission ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 h-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedSubmission.subject}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap gap-2">
                    <div className="flex items-center space-x-1">
                      <FiUser className="h-4 w-4" />
                      <span>{selectedSubmission.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiMail className="h-4 w-4" />
                      <span>{selectedSubmission.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="h-4 w-4" />
                      <span>{new Date(selectedSubmission.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  {selectedSubmission.status !== 'read' && (
                    <button
                      onClick={() => handleMarkAsRead(selectedSubmission.id)}
                      disabled={actionLoading}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                      Mark Read
                    </button>
                  )}
                  {selectedSubmission.status !== 'replied' && (
                    <button
                      onClick={() => handleMarkAsReplied(selectedSubmission.id)}
                      disabled={actionLoading}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors disabled:opacity-50"
                    >
                      Mark Replied
                    </button>
                  )}
                  {selectedSubmission.status !== 'archived' && (
                    <button
                      onClick={() => handleArchive(selectedSubmission.id)}
                      disabled={actionLoading}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedSubmission.id)}
                    disabled={actionLoading}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSubmission.status)}`}>
                {getStatusIcon(selectedSubmission.status)}
                <span className="ml-1 capitalize">{selectedSubmission.status}</span>
              </span>
            </div>

            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="flex space-x-3">
                <a 
                  href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}&body=Dear ${selectedSubmission.name},%0D%0A%0D%0A`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiMail className="h-4 w-4" />
                  <span>Reply via Email</span>
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(selectedSubmission.email)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Copy Email
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FiMessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>Select a message to view details</p>
              <p className="text-sm mt-1">Click on any message from the list</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSubmissions;