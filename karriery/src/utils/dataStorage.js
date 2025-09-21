// Data Storage Management System - JSON File Based
class DataStorage {
  constructor() {
    this.dataPath = '/src/data/';
    this.usersFile = 'users.json';
    this.supportFile = 'support.json';
    this.systemFile = 'system.json';
    this.initializeDataFiles();
    this.initializeDefaultAdmin();
  }

  initializeDefaultAdmin() {
    const users = this.getAllUsers();
    const adminExists = users.find(user => user.email === 'admin');
    
    if (!adminExists) {
      const adminUser = {
        id: 'admin_001',
        name: 'Administrator',
        email: 'admin',
        password: 'admin',
        role: 'admin',
        isGoogleUser: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        profile: {
          title: 'System Administrator',
          company: 'Karriery Platform',
          location: 'Global',
          experience: '10+ years',
          bio: 'System administrator with full platform access and management capabilities.',
          skills: ['System Administration', 'Platform Management', 'User Management', 'Security'],
          education: [
            {
              degree: 'Master of Information Technology',
              school: 'Administrative Institute',
              year: '2020'
            }
          ],
          experience_details: [
            {
              title: 'System Administrator',
              company: 'Karriery Platform',
              period: '2020 - Present',
              description: 'Managing platform infrastructure, user accounts, and system security'
            }
          ],
          avatar: null,
          phone: '',
          website: '',
          linkedin: '',
          github: '',
          twitter: ''
        },
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          privacy: {
            profileVisibility: 'public',
            showEmail: true,
            showPhone: false
          }
        },
        status: 'active',
        notifications: []
      };
      
      users.push(adminUser);
      this.saveUsers(users);
      this.updateStatistics();
    }
  }

  // Initialize data files if they don't exist
  initializeDataFiles() {
    this.ensureFileExists(this.usersFile, {
      users: [],
      lastUpdated: new Date().toISOString()
    });

    this.ensureFileExists(this.supportFile, {
      tickets: [],
      lastUpdated: new Date().toISOString()
    });

    this.ensureFileExists(this.systemFile, {
      settings: {
        siteName: 'Karriery',
        version: '1.0.0',
        maintenance: false
      },
      statistics: {
        totalUsers: 0,
        totalTickets: 0,
        activeUsers: 0
      },
      lastUpdated: new Date().toISOString()
    });
  }

  // Ensure file exists with default data
  ensureFileExists(filename, defaultData) {
    try {
      const data = this.readFile(filename);
      if (!data) {
        this.writeFile(filename, defaultData);
      }
    } catch (error) {
      this.writeFile(filename, defaultData);
    }
  }

  // Read JSON file
  readFile(filename) {
    try {
      // In a real implementation, this would read from actual files
      // For now, we'll use localStorage as a fallback
      const data = localStorage.getItem(`karriery_${filename}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading file ${filename}:`, error);
      return null;
    }
  }

  // Write JSON file
  writeFile(filename, data) {
    try {
      // In a real implementation, this would write to actual files
      // For now, we'll use localStorage as a fallback
      localStorage.setItem(`karriery_${filename}`, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing file ${filename}:`, error);
      return false;
    }
  }

  // User Management
  getAllUsers() {
    const data = this.readFile(this.usersFile);
    return data ? data.users : [];
  }

  authenticateUser(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.updateUser(user);
      return user;
    }
    throw new Error('Invalid email or password');
  }

  authenticateGoogleUser(googleUserData) {
    const users = this.getAllUsers();
    const user = users.find(u => u.googleId === googleUserData.id || u.email === googleUserData.email);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.updateUser(user);
      return user;
    }
    return null;
  }

  getCurrentUser() {
    const userData = localStorage.getItem('karriery_current_user');
    return userData ? JSON.parse(userData) : null;
  }

  setCurrentUser(user) {
    localStorage.setItem('karriery_current_user', JSON.stringify(user));
  }

  clearCurrentUser() {
    localStorage.removeItem('karriery_current_user');
  }

  getAllUsersForAdmin() {
    return this.getAllUsers();
  }

  updateUserProfile(userId, profileData) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.profile = { ...user.profile, ...profileData };
      this.saveUsers(users);
      return user;
    }
    return null;
  }

  updateUserPreferences(userId, preferences) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.preferences = { ...user.preferences, ...preferences };
      this.saveUsers(users);
      return user;
    }
    return null;
  }

  changeUserRole(userId, newRole) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      this.saveUsers(users);
      return true;
    }
    return false;
  }

  changeUserStatus(userId, newStatus) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = newStatus;
      this.saveUsers(users);
      return true;
    }
    return false;
  }

  exportUserData(userId) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      return JSON.stringify(user, null, 2);
    }
    return null;
  }

  saveUsers(users) {
    const data = {
      users: users,
      lastUpdated: new Date().toISOString()
    };
    return this.writeFile(this.usersFile, data);
  }

  createUser(userData) {
    const users = this.getAllUsers();
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user',
      isGoogleUser: userData.isGoogleUser || false,
      googleId: userData.googleId || null,
      profileImage: userData.profileImage || null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      profile: {
        title: userData.title || 'Professional',
        company: userData.company || '',
        location: userData.location || '',
        experience: userData.experience || '0-2 years',
        bio: userData.bio || 'Welcome to my professional profile!',
        skills: userData.skills || [],
        education: userData.education || [],
        experience_details: userData.experience_details || [],
        avatar: userData.profileImage || null,
        phone: userData.phone || '',
        website: userData.website || '',
        linkedin: userData.linkedin || '',
        github: userData.github || '',
        twitter: userData.twitter || ''
      },
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: true,
          showPhone: false
        }
      },
      status: 'active',
      notifications: []
    };

    users.push(newUser);
    this.saveUsers(users);
    this.updateStatistics();
    return newUser;
  }

  updateUser(updatedUser) {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
      return true;
    }
    
    return false;
  }

  deleteUser(userId) {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    this.saveUsers(filteredUsers);
    this.updateStatistics();
  }

  // Support Ticket Management
  getAllTickets() {
    const data = this.readFile(this.supportFile);
    return data ? data.tickets : [];
  }

  saveTickets(tickets) {
    const data = {
      tickets: tickets,
      lastUpdated: new Date().toISOString()
    };
    return this.writeFile(this.supportFile, data);
  }

  createTicket(ticketData) {
    const tickets = this.getAllTickets();
    
    const newTicket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: ticketData.userId,
      userName: ticketData.userName,
      userEmail: ticketData.userEmail,
      subject: ticketData.subject,
      message: ticketData.message,
      category: ticketData.category || 'general',
      priority: ticketData.priority || 'medium',
      status: 'open',
      attachments: ticketData.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
      adminReplies: []
    };

    tickets.push(newTicket);
    this.saveTickets(tickets);
    this.updateStatistics();
    return newTicket;
  }

  updateTicket(ticketId, updates) {
    const tickets = this.getAllTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    
    if (index !== -1) {
      tickets[index] = { ...tickets[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveTickets(tickets);
      return true;
    }
    
    return false;
  }

  addReplyToTicket(ticketId, reply) {
    const tickets = this.getAllTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (ticket) {
      const newReply = {
        id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: reply.userId,
        userName: reply.userName,
        userRole: reply.userRole,
        message: reply.message,
        attachments: reply.attachments || [],
        createdAt: new Date().toISOString()
      };

      if (reply.userRole === 'admin') {
        ticket.adminReplies.push(newReply);
      } else {
        ticket.replies.push(newReply);
      }

      ticket.updatedAt = new Date().toISOString();
      this.saveTickets(tickets);
      return newReply;
    }
    
    return null;
  }

  // Notification System
  addNotification(userId, notification) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
      const newNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: false,
        createdAt: new Date().toISOString(),
        data: notification.data || {}
      };

      user.notifications = user.notifications || [];
      user.notifications.unshift(newNotification);
      
      // Keep only last 50 notifications
      if (user.notifications.length > 50) {
        user.notifications = user.notifications.slice(0, 50);
      }

      this.saveUsers(users);
      return newNotification;
    }
    
    return null;
  }

  markNotificationAsRead(userId, notificationId) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (user && user.notifications) {
      const notification = user.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        this.saveUsers(users);
        return true;
      }
    }
    
    return false;
  }

  // Statistics
  updateStatistics() {
    const users = this.getAllUsers();
    const tickets = this.getAllTickets();
    
    const statistics = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === 'open').length,
      closedTickets: tickets.filter(t => t.status === 'closed').length
    };

    const systemData = this.readFile(this.systemFile);
    systemData.statistics = statistics;
    systemData.lastUpdated = new Date().toISOString();
    
    this.writeFile(this.systemFile, systemData);
  }

  getStatistics() {
    const data = this.readFile(this.systemFile);
    return data ? data.statistics : {};
  }

  // Export/Import functionality
  exportAllData() {
    return {
      users: this.getAllUsers(),
      tickets: this.getAllTickets(),
      system: this.readFile(this.systemFile),
      exportedAt: new Date().toISOString()
    };
  }

  importData(data) {
    try {
      if (data.users) {
        this.saveUsers(data.users);
      }
      if (data.tickets) {
        this.saveTickets(data.tickets);
      }
      if (data.system) {
        this.writeFile(this.systemFile, data.system);
      }
      this.updateStatistics();
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Search functionality
  searchUsers(query) {
    const users = this.getAllUsers();
    const lowercaseQuery = query.toLowerCase();
    
    return users.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.profile?.title?.toLowerCase().includes(lowercaseQuery) ||
      user.profile?.company?.toLowerCase().includes(lowercaseQuery)
    );
  }

  searchTickets(query) {
    const tickets = this.getAllTickets();
    const lowercaseQuery = query.toLowerCase();
    
    return tickets.filter(ticket => 
      ticket.subject.toLowerCase().includes(lowercaseQuery) ||
      ticket.message.toLowerCase().includes(lowercaseQuery) ||
      ticket.userName.toLowerCase().includes(lowercaseQuery) ||
      ticket.userEmail.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Create singleton instance
const dataStorage = new DataStorage();

export default dataStorage;
