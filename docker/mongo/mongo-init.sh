#!/bin/bash
set -e

mongo <<EOF
db = db.getSiblingDB(_getEnv('MONGO_DB'))

db.createUser({
    user: _getEnv('MONGO_DB_USERNAME'),
    pwd: _getEnv('MONGO_DB_PASSWORD'),
    roles: [
        {
            role: 'dbOwner',
            db: _getEnv('MONGO_DB'),
        },
    ],
});
EOF