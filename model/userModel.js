const createUserSchema = (username, email, profileImage = null) => {
    return {
      username,
      email,
      profileImage,
      createdAt: new Date().toISOString(),
    };
  };
  
  export default createUserSchema;
  
  