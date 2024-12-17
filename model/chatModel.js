const createChatSchema = (currentUserId, contact) => {
    return {
      members: [currentUserId, contact.id], // Array of user IDs
      username: contact.username, // Contact's username
      avatar: contact.avatar || null, // Optional avatar URL
      messages: [], // Empty messages array
      createdAt: new Date().toISOString(), // Timestamp for creation
    };
  };
  
  export default createChatSchema;
  
  
  