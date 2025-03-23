package queries

import (
	"discord-server/structs"
	"fmt"
	"log"

	"github.com/gocql/gocql"
)

func InsertUser(session *gocql.Session, user structs.User) (structs.User, error) {

	insertQuery := `INSERT INTO users (username, password) VALUES (?, ?)`

	err := session.Query(insertQuery, user.Username, user.Password).Exec()
	if err != nil {
		log.Fatal("Failed to insert user:", err)
	}

	fmt.Println("User inserted successfully!")

	return user, err
}
