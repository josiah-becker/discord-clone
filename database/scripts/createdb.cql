CREATE KEYSPACE discord_db 
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE discord_db;

CREATE TABLE users (
    id UUID,
    name TEXT,
);
