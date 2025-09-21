import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext.jsx';
import dataStorage from '../utils/dataStorage.js';

const SupportChat = ({ user, isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [attachments, setAttachments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payment' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#28a745' },
    { value: 'medium', label: 'Medium', color: '#ffc107' },
    { value: 'high', label: 'High', color: '#fd7e14' },
    { value: 'urgent', label: 'Urgent', color: '#dc3545' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadTickets();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket]);

  const loadTickets = () => {
    const allTickets = dataStorage.getAllTickets();
    const userTickets = user.role === 'admin' 
      ? allTickets 
      : allTickets.filter(ticket => ticket.userId === user.id);
    setTickets(userTickets);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(attachments.filter(att => att.id !== attachmentId));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setLoading(true);
    try {
      const ticketData = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        subject: subject.trim(),
        message: message.trim(),
        category,
        priority,
        attachments: attachments.map(att => ({
          name: att.name,
          size: att.size,
          type: att.type
        }))
      };

      const newTicket = dataStorage.createTicket(ticketData);
      setTickets([...tickets, newTicket]);
      setSelectedTicket(newTicket);
      setActiveTab('tickets');
      
      // Reset form
      setSubject('');
      setMessage('');
      setAttachments([]);
      setCategory('general');
      setPriority('medium');
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    setLoading(true);
    try {
      const reply = {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        message: replyMessage.trim()
      };

      const newReply = dataStorage.addReplyToTicket(selectedTicket.id, reply);
      
      // Update ticket in state
      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, replies: [...ticket.replies, newReply] }
          : ticket
      );
      setTickets(updatedTickets);
      setSelectedTicket({ ...selectedTicket, replies: [...selectedTicket.replies, newReply] });
      
      // Send notification to user if admin replied
      if (user.role === 'admin') {
        dataStorage.addNotification(selectedTicket.userId, {
          type: 'ticket_reply',
          title: 'New Reply to Your Ticket',
          message: `Admin ${user.name} has replied to your ticket: ${selectedTicket.subject}`,
          data: { ticketId: selectedTicket.id }
        });
      }

      setReplyMessage('');
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#28a745';
      case 'in_progress': return '#ffc107';
      case 'closed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="support-chat"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: isExpanded ? '350px' : '60px',
        height: isExpanded ? '400px' : '60px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Chat Header */}
      <div style={{
        background: '#8B1538',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer'
      }} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-headset"></i>
          {isExpanded && <span>Support Chat</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isExpanded && (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div style={{ height: 'calc(100% - 60px)', display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e5e5'
          }}>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: activeTab === 'chat' ? '#f8f9fa' : 'white',
                color: activeTab === 'chat' ? '#8B1538' : '#666',
                cursor: 'pointer',
                fontWeight: activeTab === 'chat' ? '600' : '400'
              }}
            >
              <i className="fas fa-comments"></i> New Ticket
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                background: activeTab === 'tickets' ? '#f8f9fa' : 'white',
                color: activeTab === 'tickets' ? '#8B1538' : '#666',
                cursor: 'pointer',
                fontWeight: activeTab === 'tickets' ? '600' : '400'
              }}
            >
              <i className="fas fa-ticket-alt"></i> My Tickets
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {activeTab === 'chat' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
                  <form onSubmit={handleSubmitTicket}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief description of your issue"
                        required
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}
                      >
                        {priorities.map(pri => (
                          <option key={pri.value} value={pri.value}>{pri.label}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Message *
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your issue in detail..."
                        required
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Attachments
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#f8f9fa',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        <i className="fas fa-paperclip"></i> Add Files
                      </button>
                      
                      {attachments.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          {attachments.map(att => (
                            <div key={att.id} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.25rem',
                              background: '#f8f9fa',
                              borderRadius: '4px',
                              marginBottom: '0.25rem'
                            }}>
                              <span style={{ fontSize: '0.8rem' }}>
                                {att.name} ({formatFileSize(att.size)})
                              </span>
                              <button
                                type="button"
                                onClick={() => removeAttachment(att.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#dc3545',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem'
                                }}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#8B1538',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        'Submit Ticket'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {selectedTicket ? (
                  <>
                    {/* Ticket Details */}
                    <div style={{
                      padding: '0.5rem',
                      borderBottom: '1px solid #e5e5e5',
                      background: '#f8f9fa',
                      fontSize: '0.875rem',
                      lineHeight: '1.2' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0 }}>{selectedTicket.subject}</h4>
                        <button
                          onClick={() => setSelectedTicket(null)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#666',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
                        <span>Status: <span style={{ color: getStatusColor(selectedTicket.status) }}>{selectedTicket.status}</span></span>
                        <span>Priority: <span style={{ color: priorities.find(p => p.value === selectedTicket.priority)?.color }}>{selectedTicket.priority}</span></span>
                        <span>Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                      {/* Original Message */}
                      <div style={{
                        background: '#e3f2fd',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                          {selectedTicket.userName} (Original Message)
                        </div>
                        <div>{selectedTicket.message}</div>
                        {selectedTicket.attachments.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <strong>Attachments:</strong>
                            {selectedTicket.attachments.map((att, index) => (
                              <div key={index} style={{ fontSize: '0.8rem', color: '#666' }}>
                                📎 {att.name} ({formatFileSize(att.size)})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Replies */}
                      {[...selectedTicket.replies, ...selectedTicket.adminReplies]
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                        .map((reply, index) => (
                          <div key={reply.id} style={{
                            background: reply.userRole === 'admin' ? '#fff3cd' : '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            marginLeft: reply.userRole === 'admin' ? '0' : '2rem'
                          }}>
                            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                              {reply.userName} {reply.userRole === 'admin' && '(Admin)'}
                            </div>
                            <div>{reply.message}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                              {new Date(reply.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Reply Form */}
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      borderTop: '1px solid #e5e5e5',
                      background: '#f8f9fa',
                      fontsize: "0.5rem",
                      lineheight: "0"
                    }}>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          resize: 'vertical',
                          marginBottom: '0.5rem'
                        }}
                      />
                      <button
                        onClick={handleReply}
                        disabled={loading || !replyMessage.trim()}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#8B1538',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: loading || !replyMessage.trim() ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem',
                          opacity: loading || !replyMessage.trim() ? 0.7 : 1
                        }}
                      >
                        {loading ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '1rem', height: '100%', overflowY: 'auto' }}>
                    {tickets.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
                        <i className="fas fa-ticket-alt" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                        <p>No tickets found</p>
                      </div>
                    ) : (
                      tickets.map(ticket => (
                        <div
                          key={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          style={{
                            padding: '1rem',
                            border: '1px solid #e5e5e5',
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                            {ticket.subject}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                            {ticket.message.substring(0, 100)}...
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
                            <span>Status: <span style={{ color: getStatusColor(ticket.status) }}>{ticket.status}</span></span>
                            <span>Priority: <span style={{ color: priorities.find(p => p.value === ticket.priority)?.color }}>{ticket.priority}</span></span>
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SupportChat;
