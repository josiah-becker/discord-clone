package main

import (
	"fmt"
	"log"

	"github.com/gocql/gocql"
)

func insertUser(session *gocql.Session, user User) (User, error) {

	insertQuery := `INSERT INTO users (id, username, age) VALUES (?, ?, ?)`

	err := session.Query(insertQuery, user.id, user.username, user.age).Exec()
	if err != nil {
		log.Fatal("Failed to insert data:", err)
	}

	fmt.Println("Data inserted successfully!")

	return user, err
}
