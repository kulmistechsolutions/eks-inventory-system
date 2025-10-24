import Activity from '../models/Activity.js';

export const logActivity = async (userId, action, description, type, entityType, entityId = null, metadata = {}) => {
  try {
    const activity = new Activity({
      userId,
      action,
      description,
      type,
      entityType,
      entityId,
      metadata
    });

    await activity.save();
    return activity;
  } catch (error) {
    console.error('Failed to log activity:', error);
    return null;
  }
};

// Helper functions for common activities
export const logLogin = async (userId, userEmail) => {
  return await logActivity(
    userId,
    'User Login',
    `User ${userEmail} logged in to the system`,
    'login',
    'user',
    userId,
    { loginTime: new Date() }
  );
};

export const logLogout = async (userId, userEmail) => {
  return await logActivity(
    userId,
    'User Logout',
    `User ${userEmail} logged out of the system`,
    'logout',
    'user',
    userId,
    { logoutTime: new Date() }
  );
};

export const logSale = async (userId, saleId, saleAmount, customerName) => {
  return await logActivity(
    userId,
    'Sale Created',
    `Made a sale of $${saleAmount} to ${customerName}`,
    'sale',
    'sale',
    saleId,
    { amount: saleAmount, customer: customerName }
  );
};

export const logRepair = async (userId, repairId, repairNumber, status, customerName) => {
  const action = status === 'completed' ? 'Repair Completed' : 'Repair Updated';
  const description = status === 'completed' 
    ? `Completed repair ${repairNumber} for ${customerName}`
    : `Updated repair ${repairNumber} for ${customerName}`;
  
  return await logActivity(
    userId,
    action,
    description,
    'repair',
    'repair',
    repairId,
    { repairNumber, status, customer: customerName }
  );
};

export const logProfileUpdate = async (userId, userEmail) => {
  return await logActivity(
    userId,
    'Profile Updated',
    `User ${userEmail} updated their profile information`,
    'profile',
    'profile',
    userId,
    { updateTime: new Date() }
  );
};
