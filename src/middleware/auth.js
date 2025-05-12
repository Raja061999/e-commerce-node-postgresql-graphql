export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization || '';
  
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      } catch (err) {
        req.user = null;
      }
    }
  
    next();
  };

  export const isAdmin = (user) => {
    console.log(user)
    if (!user) throw new Error('Not authenticated');
    if (user.role !== 'ADMIN') throw new Error('Access denied: Admins only');
  };
  