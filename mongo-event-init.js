db = db.getSiblingDB('event');

db.createUser({
    user: 'event_user',
    pwd: 'event_user_password',
    roles: [{ role: 'readWrite', db: 'event' }]
});
