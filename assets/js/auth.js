// Simple client-side auth and profile storage using localStorage
// Keys
var STORAGE_KEYS = {
  users: 'sp_users',
  session: 'sp_session_user',
};

function readUsers(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]'); }catch(e){ return []; }
}
function writeUsers(users){
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}
function findUserByEmail(email){
  var users = readUsers();
  return users.find(function(u){ return (u.email || '').toLowerCase() === (email || '').toLowerCase(); }) || null;
}
function createUser(user){
  var users = readUsers();
  if(findUserByEmail(user.email)) throw new Error('User already exists');
  users.push(user);
  writeUsers(users);
  return user;
}
function updateUser(email, updates){
  var users = readUsers();
  var idx = users.findIndex(function(u){ return (u.email || '').toLowerCase() === (email || '').toLowerCase(); });
  if(idx === -1) return null;
  users[idx] = Object.assign({}, users[idx], updates);
  writeUsers(users);
  var session = getSession();
  if(session && session.email && session.email.toLowerCase() === email.toLowerCase()){
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(users[idx]));
  }
  return users[idx];
}
function signIn(email, password){
  var user = findUserByEmail(email);
  if(!user || user.password !== password) throw new Error('Invalid email or password');
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
  return user;
}
function signOut(){
  localStorage.removeItem(STORAGE_KEYS.session);
}
function getSession(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || 'null'); }catch(e){ return null; }
}
function requireAuth(redirectTo){
  if(!getSession()){
    window.location.href = redirectTo || 'login.html';
  }
}

// Expose helpers on window for ease of use in simple pages
window.SpotnPlayAuth = {
  readUsers: readUsers,
  writeUsers: writeUsers,
  findUserByEmail: findUserByEmail,
  createUser: createUser,
  updateUser: updateUser,
  signIn: signIn,
  signOut: signOut,
  getSession: getSession,
  requireAuth: requireAuth,
};



