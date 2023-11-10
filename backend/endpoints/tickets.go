package endpoints

import (
	// "context"
	// "fmt"
	// "net/http"
	// "time"

	//"backend/schemas"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/mongo"
	//"go.mongodb.org/mongo-driver/bson/primitive"
	//"go.mongodb.org/mongo-driver/bson"
	//"github.com/gin-gonic/gin"
)

var validatorInstance = validator.New()
var ticketCollection *mongo.Collection = connectToCollection(Client, "tickets")
