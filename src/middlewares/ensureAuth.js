import jwt from 'jsonwebtoken';

function ensureAuth(req, res, next){
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'JWT token is missing.' });
  }

  const [, token] = authHeader.split(' ');
    
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Invalid token.' });
  
    req.userId = decoded.id;
    next();
  });
}

export default ensureAuth;
