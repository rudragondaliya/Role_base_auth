
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
     
      return res.status(403).render('pages/403', { message: 'Access denied' });
    }
    next();
  };
};


exports.allowSelfOrRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    const targetId = req.params.id || req.body.id || req.query.id;

    if (!user) return res.redirect('/login');

   
    if (allowedRoles.includes(user.role)) return next();

    
    if (user.role === 'employee' && targetId && user._id.toString() === targetId) return next();

    return res.status(403).render('pages/403', { message: 'Access denied' });
  };
};


exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role.toLowerCase())) {
      return res.status(403).send("Access Denied: You do not have permission.");
    }
    next();
  };
};
