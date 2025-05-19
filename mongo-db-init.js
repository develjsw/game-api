db = db.getSiblingDB('game');

db.createUser({
    user: 'game_user',
    pwd: 'game_user_password',
    roles: [{ role: 'readWrite', db: 'game' }]
});
