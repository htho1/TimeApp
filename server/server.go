package main

import (
	"context"
	"fmt"
	"log"
	"crypto/rand"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

// Generate a random authentication token
// Credit: https://stackoverflow.com/questions/25431658/how-to-generate-a-random-token-with-md5
func genToken() string {
	b := make([]byte, 8)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

func main() {
	// Set up the HTTP servers
	// and the MongoDB client.
	fmt.Println("Server has started.")

	app := fiber.New()

	MONGODB_URI := "mongodb://localhost:27017/"
	mongoClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(MONGODB_URI))
	db := mongoClient.Database("timeapp")

	authedUsers := make(map[string]string)

	if err != nil {
		panic(err)
	}

	app.Get("/", func(ctx fiber.Ctx) error {
		return ctx.SendString("Hello world")
	})

	// Register a user account in the database.
	//
	// Headers:
	// username: The account's username
	// pswd: The account's password
	// 
	// Returns:
	// JSON object containing the new UUID
	// and an authentication token.
	app.Post("/register", func(ctx fiber.Ctx) error {
		userColl := db.Collection("users")

		username := ctx.Get("username")
		hashedPswd, err := bcrypt.GenerateFromPassword([]byte(ctx.Get("pswd")), 10)
		uuid := uuid.NewString()

		if err != nil {
			panic(err)
		}

		// Inserts the user data into
		// the MongoDB database.
		_, err = userColl.InsertOne(
			context.TODO(),
			bson.D{
				{Key: "_id", Value: uuid},
				{Key: "username", Value: username},
				{Key: "pswd", Value: hashedPswd},
			},
		)

		if err != nil {
			panic(err)
		}
		return ctx.SendString("Done.")
	})

	// User login. Returns an authorization token if
	// username and password match.
	//
	// Headers:
	// username: the username of the account to authenticate
	// pswd: the password of the account
	app.Post("/auth", func(ctx fiber.Ctx) error {
		userColl := db.Collection("users")

		username := ctx.Get("username")
		pswd := ctx.Get("pswd")

		var result bson.M
		err := userColl.FindOne(
			context.TODO(),
			bson.D{
				{Key: "username", Value: username},
			},
		).Decode(&result)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				return ctx.SendString("ErrNoDocuments")
			}
			panic(err)
		}

		err = bcrypt.CompareHashAndPassword(result["pswd"].(primitive.Binary).Data, []byte(pswd))

		if err != nil {
			return ctx.SendString("ErrHashFail")
		}

		token := genToken()
		authedUsers[token] = result["_id"].(string)
		fmt.Println(authedUsers)

		return ctx.SendString(token)
	})

	log.Fatal(app.Listen(":8080"))
}