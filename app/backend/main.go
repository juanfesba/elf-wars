package main

// Sources
// https://medium.com/geekculture/full-stack-application-with-go-gin-react-and-mongodb-37b63ef71133
// https://www.youtube.com/watch?v=bj77B59nkTQ&t=562s

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// Handler holds all kind of dependencies.
type Handler struct {
	DB *gorm.DB
}

type BallDB struct {
	Name   string `gorm:"primaryKey"`
	Color  string `gorm:"primaryKey"`
	Amount int
}

type Ball struct {
	Name   string `json:"name"`
	Color  string `json:"color"`
	Amount int    `json:"amount"`
}

func addBall(db *gorm.DB, ball *Ball) {
	dbBall := ballToBallDB(ball)

	db.Clauses(clause.OnConflict{
		// 1. Identify the conflict columns
		Columns: []clause.Column{{Name: "name"}, {Name: "color"}},

		// 2. Use 'ball_dbs' (the actual table name) or 'excluded'
		DoUpdates: clause.Assignments(map[string]interface{}{
			"amount": gorm.Expr("ball_dbs.amount + ?", dbBall.Amount),
		}),
	}).Create(dbBall)
}

func ballToBallDB(ball *Ball) *BallDB {
	dbBall := BallDB{
		Name:   ball.Name,
		Color:  ball.Color,
		Amount: ball.Amount,
	}
	return &dbBall
}

func ballDBToBall(dbBall *BallDB) *Ball {
	ball := Ball{
		Name:   dbBall.Name,
		Color:  dbBall.Color,
		Amount: dbBall.Amount,
	}
	return &ball
}

func (hdlr *Handler) postMethod(c *gin.Context) {
	var ball Ball

	if err := c.BindJSON(&ball); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("Obtained ball: %+v\n", ball)
	addBall(hdlr.DB, &ball)
	fmt.Println("Added ball succesfully. About to respond.")
	c.JSON(http.StatusCreated, ball)
}

func (hdlr *Handler) getBalls() []*Ball {
	dbBalls := make([]*BallDB, 0) // Just to make the linter happy, nil would be fine.
	hdlr.DB.Find(&dbBalls)
	fmt.Printf("juandebug getBalls: %v", dbBalls)

	balls := make([]*Ball, len(dbBalls))
	for i, dbBall := range dbBalls {
		balls[i] = ballDBToBall(dbBall)
	}
	return balls
}

func main() {
	fmt.Println("Hello, World!")

	// 1. Pull the port from the environment
	port := os.Getenv("PORT")

	// 2. Local fallback for when you run 'go run main.go' without Docker
	if port == "" {
		port = "8080"
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"), os.Getenv("DB_PORT"))

	var db *gorm.DB
	var err error

	// 1. Retry Connection (Wait for DB to wake up)
	for i := 0; i < 10; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Waiting for DB... (%d/10)", i+1)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 2. THE MAGIC: Auto-Migration
	// This compares your Go Struct 'User' with the DB tables.
	// It will CREATE tables or ADD columns automatically.
	db.AutoMigrate(&BallDB{})

	handler := &Handler{DB: db}

	r := gin.Default()
	r.SetTrustedProxies(nil)

	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:8081" // Local dev fallback
	}

	// Safer CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{allowedOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           8 * time.Hour,
	}))
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong v0.0.11",
		})
	})
	r.GET("/inventory", func(c *gin.Context) {
		c.IndentedJSON(http.StatusOK, handler.getBalls())
	})
	r.POST("/throw", handler.postMethod)
	err = r.Run(":" + port) // (for windows "http://localhost:8080/ping")
	if err != nil {
		fmt.Printf("Error starting server: %+v\n", err)
	}

	fmt.Println("Server started (finished?) on port 8080")
}
