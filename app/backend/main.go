package main

// Sources
// https://medium.com/geekculture/full-stack-application-with-go-gin-react-and-mongodb-37b63ef71133
// https://www.youtube.com/watch?v=bj77B59nkTQ&t=562s

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Ball struct {
	Name   string `json:"name"`
	Color  string `json:"color"`
	Amount int    `json:"amount"`
}

var balls = []*Ball{
	{Name: "Football", Color: "White", Amount: 3},
	{Name: "Basket", Color: "Orange", Amount: 7},
}

func addBall(ball *Ball) {
	for _, eb := range balls {
		if ball.Name == eb.Name && ball.Color == eb.Color {
			eb.Amount += ball.Amount
			return
		}
	}
	if ball.Amount != 0 {
		balls = append(balls, ball)
	}
}

func postMethod(c *gin.Context) {
	var ball Ball

	if err := c.BindJSON(&ball); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("Obtained ball: %+v\n", ball)
	addBall(&ball)
	fmt.Println("Added ball succesfully. About to respond.")
	c.JSON(http.StatusCreated, ball)
}

func main() {
	fmt.Println("Hello, World!")

	// 1. Pull the port from the environment
	port := os.Getenv("PORT")

	// 2. Local fallback for when you run 'go run main.go' without Docker
	if port == "" {
		port = "8080"
	}

	r := gin.Default()
	// Safer CORS configuration
	r.Use(cors.New(cors.Config{
		// Replace this with your actual Cloud Run / Frontend URL
		// AllowOrigins:     []string{"https://my-react-app.web.app", "http://localhost:3000"},
		AllowOrigins:     []string{"http://localhost:8081"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           8 * time.Hour,
	}))
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong v0.0.10",
		})
	})
	r.GET("/inventory", func(c *gin.Context) {
		c.IndentedJSON(http.StatusOK, balls)
	})
	r.POST("/throw", postMethod)
	err := r.Run(":" + port) // (for windows "http://localhost:8080/ping")
	if err != nil {
		fmt.Printf("Error starting server: %+v\n", err)
	}

	fmt.Println("Server started (finished?) on port 8080")
}
