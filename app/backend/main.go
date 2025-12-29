package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// User struct with JSON tags
type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func main() {
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		user := User{
			ID:    101,
			Name:  "Docker User",
			Email: "user@example.com",
		}
		// Returns 200 OK with JSON body
		c.JSON(http.StatusOK, user)
	})

	r.Run(":8080")
}
