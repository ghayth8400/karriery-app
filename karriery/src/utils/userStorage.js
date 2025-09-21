// User Storage Management System
class UserStorage {
  constructor() {
    this.storageKey = 'karriery_users';
    this.currentUserKey = 'karriery_current_user';
    this.initializeDefaultAdmin();
  }

  // Initialize default admin account
  initializeDefaultAdmin() {
    const users = this.getAllUsers();
    const adminExists = users.find(user => user.email === 'admin' && user.role === 'admin');
    
    if (!adminExists) {
      const defaultAdmin = {
        id: 'admin_001',
        name: 'Administrator',
        email: 'admin',
        password: 'admin', // In production, this should be hashed
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
        status: 'active'
      };
      
      users.push(defaultAdmin);
      this.saveUsers(users);
    }
  }

  // Get all users
  getAllUsers() {
    try {
      const users = localStorage.getItem(this.storageKey);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  // Save all users
  saveUsers(users) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // Create new user account
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
      password: userData.password, // In production, this should be hashed
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
      status: 'active'
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  // Authenticate user
  authenticateUser(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    if (user.status !== 'active') {
      throw new Error('Account is deactivated');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.updateUser(user);

    return user;
  }

  // Authenticate Google user
  authenticateGoogleUser(googleUserData) {
    const users = this.getAllUsers();
    let user = users.find(u => u.googleId === googleUserData.id || u.email === googleUserData.email);
    
    if (!user) {
      // Create new user for Google sign-in
      const newUserData = {
        name: googleUserData.name,
        email: googleUserData.email,
        password: `google_${googleUserData.id}`, // Placeholder password for Google users
        isGoogleUser: true,
        googleId: googleUserData.id,
        profileImage: googleUserData.picture
      };
      
      user = this.createUser(newUserData);
    } else {
      // Update existing user's last login
      user.lastLogin = new Date().toISOString();
      user.profileImage = googleUserData.picture;
      this.updateUser(user);
    }

    return user;
  }

  // Update user data
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

  // Update user profile
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

  // Update user preferences
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

  // Delete user
  deleteUser(userId) {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    this.saveUsers(filteredUsers);
  }

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem(this.currentUserKey);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error loading current user:', error);
      return null;
    }
  }

  // Set current user
  setCurrentUser(user) {
    try {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  // Clear current user (logout)
  clearCurrentUser() {
    localStorage.removeItem(this.currentUserKey);
  }

  // Admin functions
  getAllUsersForAdmin() {
    return this.getAllUsers().map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isGoogleUser: user.isGoogleUser
    }));
  }

  // Change user role (admin only)
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

  // Change user status (admin only)
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

  // Get user statistics
  getUserStats() {
    const users = this.getAllUsers();
    const activeUsers = users.filter(u => u.status === 'active');
    const googleUsers = users.filter(u => u.isGoogleUser);
    const adminUsers = users.filter(u => u.role === 'admin');
    
    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      googleUsers: googleUsers.length,
      adminUsers: adminUsers.length,
      regularUsers: users.length - adminUsers.length
    };
  }

  // Search users
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

  // Export user data
  exportUserData(userId) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    return user ? JSON.stringify(user, null, 2) : null;
  }

  // Import user data (admin only)
  importUserData(userData) {
    try {
      const user = JSON.parse(userData);
      const users = this.getAllUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === user.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      users.push(user);
      this.saveUsers(users);
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }
}

// Create singleton instance
const userStorage = new UserStorage();

export default userStorage;
