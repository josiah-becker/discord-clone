package main

import (
	"fmt"
	"log"

	"github.com/gocql/gocql"
)

func main() {
	// Create a Cassandra cluster configuration
	cluster := gocql.NewCluster("localhost:9042") // Default port is 9042, not 9000
	cluster.Keyspace = "discordclone"             // Replace with your actual keyspace
	cluster.Consistency = gocql.Quorum

	// Create session
	session, err := cluster.CreateSession()
	if err != nil {
		log.Fatal("Failed to connect to Cassandra:", err)
	}
	defer session.Close()

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

	fmt.Println("Table created successfully!")

	action := "get" // Change to "get" to retrieve users

	if action == "insert" {
		user := User{
			id:       gocql.TimeUUID(),
			username: "JohnDoe",
			age:      30,
		}

		_, err := insertUser(session, user)
		if err != nil {
			log.Fatal("Failed to insert user:", err)
		}
	}

	if action == "get" {
		// Retrieve all users
		users, err := getAllUsers(session)
		if err != nil {
			log.Fatal("Failed to get users:", err)
		}

		fmt.Println("Users in the database:")
		for _, user := range users {
			fmt.Printf("ID: %s, Username: %s, Age: %d\n", user.id, user.username, user.age)
		}
	}

}
