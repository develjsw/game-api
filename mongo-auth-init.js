db = db.getSiblingDB('auth');

db.createUser({
    user: 'auth_user',
    pwd: 'auth_user_password',
    roles: [{ role: 'readWrite', db: 'auth' }]
});
