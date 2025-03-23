package main

import "github.com/gocql/gocql"

type User struct {
	id       gocql.UUID
	username string
	age      int
}

func getAllUsers(session *gocql.Session) ([]User, error) {

	var users []User

	var id gocql.UUID
	var username string
	var age int

	// Assuming session is already created and connected to Cassandra
	selectAllQuery := `SELECT * FROM users`

	iter := session.Query(selectAllQuery).Iter()
	defer iter.Close()

	for iter.Scan(&id, &age, &username) {
		users = append(users, User{id, username, age})
	}

	if err := iter.Close(); err != nil {
		return nil, err
	}

	return users, nil
}
