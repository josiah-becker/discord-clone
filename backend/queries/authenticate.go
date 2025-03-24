package queries

import "github.com/gocql/gocql"

func AuthenticateUser(session *gocql.Session, username, password string) (bool, error) {
	var storedPassword string

	query := `SELECT password FROM users WHERE username = ?`
	if err := session.Query(query, username).Consistency(gocql.One).Scan(&storedPassword); err != nil {
		return false, err
	}

	if storedPassword != password {
		return false, nil
	}

	return true, nil
}
