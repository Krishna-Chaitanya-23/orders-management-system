package endpoints

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"backend/schemas"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	//"go.mongodb.org/mongo-driver/bson"
	"github.com/gin-gonic/gin"
)

var validatorInstance = validator.New()
var ticketCollection *mongo.Collection = connectToCollection(Client, "tickets")

// CreateTicket creates a new ticket
func CreateTicket(c *gin.Context) {
	var ticket schemas.Ticket

	// Bind the JSON to the order
	if err := c.BindJSON(&ticket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate the order
	if err := validatorInstance.Struct(ticket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set a new ID for the order
	ticket.TicketID = primitive.NewObjectID()

	// Create a context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Insert the order into the collection
	result, err := ticketCollection.InsertOne(ctx, ticket)
	if err != nil {
		msg := fmt.Sprintf("ticket item was not created")
		c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		return
	}

	// Return the result
	c.JSON(http.StatusOK, result)
}
