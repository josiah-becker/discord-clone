package main

import (
	"fmt"
	"log"

	"github.com/gocql/gocql"
)

func createCassandraSession() *gocql.Session {
	// Create a Cassandra cluster configuration
	cluster := gocql.NewCluster("localhost:9042")
	cluster.Keyspace = "discordclone"
	cluster.Consistency = gocql.Quorum

	// Create session Cassandra
	session, err := cluster.CreateSession()
	if err != nil {
		log.Fatal("Failed to connect to Cassandra:", err)
	}

	fmt.Println("Connected to Cassandra successfully!")

	createTableQuery := `
	CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY,
		username TEXT,
		age INT
	);`

	createErr := session.Query(createTableQuery).Exec()
	if createErr != nil {
		log.Fatal("Failed to create table:", createErr)
	}

	return session
}
