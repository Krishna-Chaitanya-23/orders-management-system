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

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

var validatorInstance = validator.New()
var ticketCollection *mongo.Collection = connectToCollection(Client, "tickets")

// CreateTicket creates a new ticket
func CreateTicket(g *gin.Context) {
	var ticket schemas.Ticket

	// Bind the JSON to the order
	if err := g.BindJSON(&ticket); err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate the order
	if err := validatorInstance.Struct(ticket); err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set a new ID for the order
	ticket.TicketID = primitive.NewObjectID()

	// Create a context with timeout
	ct, stop := context.WithTimeout(context.Background(), 100*time.Second)
	defer stop()

	// Insert the order into the collection
	result, err := ticketCollection.InsertOne(ct, ticket)
	if err != nil {
		msg := fmt.Sprintf("ticket item was not created")
		g.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		return
	}

	// Return the result
	g.JSON(http.StatusOK, result)
}

// FetchAllTickets gets all the orders
func FetchAllTickets(g *gin.Context) {
	var tickets []bson.M

	// Create a context with timeout
	ct, stop := context.WithTimeout(context.Background(), 100*time.Second)
	defer stop()

	result, err := ticketCollection.Find(ct, bson.M{})
	if err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err = result.All(ct, &tickets); err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(tickets)
	g.JSON(http.StatusOK, tickets)
}

// FetchTicketsByAttendant gets orders by
func FetchTicketsByAttendant(g *gin.Context) {
	attendant := g.Params.ByName("attendant")
	var tickets []bson.M

	// Create a context with timeout
	ct, stop := context.WithTimeout(context.Background(), 100*time.Second)
	defer stop()

	result, err := ticketCollection.Find(ct, bson.M{"attendant": attendant})
	if err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})

		return
	}
	if err = result.All(ct, &tickets); err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(tickets)
	g.JSON(http.StatusOK, tickets)
}

// fetch a ticket by its ticket id
func FetchTicketById(g *gin.Context) {
	ticketID := g.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(ticketID)
	var ct, stop = context.WithTimeout(context.Background(), 100*time.Second)
	defer stop()
	var ticket bson.M

	if err := ticketCollection.FindOne(ct, bson.M{"_id": docID}).Decode(&ticket); err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(ticket)
	g.JSON(http.StatusOK, ticket)
}

// edit attendant's name for a ticket
func EditAttendant(g *gin.Context) {
	ticketID := g.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(ticketID)
	var ct, stop = context.WithTimeout(context.Background(), 100*time.Second)
	defer stop()

	type Attendant struct {
		Server *string `json:"attendant"`
	}
	var attendant Attendant
	if err := g.BindJSON(&attendant); err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result, err := ticketCollection.UpdateOne(ct, bson.M{"_id": docID},
		bson.D{
			{"$set", bson.D{{"attendant", attendant.Server}}},
		},
	)
	if err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	g.JSON(http.StatusOK, result.ModifiedCount)
}

// Edit the ticket
func EditTicket(g *gin.Context) {
	ticketID := g.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(ticketID)
	var ct, stop = context.WithTimeout(context.Background(), 100*time.Second)
	defer stop()

	var ticket schemas.Ticket
	if err := g.BindJSON(&ticket); err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	validationErr := validatorInstance.Struct(ticket)
	if validationErr != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		return
	}
	result, err := ticketCollection.ReplaceOne(
		ct,
		bson.M{"_id": docID},
		bson.M{
			"item":      ticket.Item,
			"itemPrice": ticket.ItemPrice,
			"attendant": ticket.Attendant,
			"table":     ticket.Table,
		},
	)
	if err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	g.JSON(http.StatusOK, result.ModifiedCount)
}

// remove a ticket given the id
func RemoveTicket(g *gin.Context) {
	ticketID := g.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(ticketID)
	var ct, stop = context.WithTimeout(context.Background(), 100*time.Second)
	defer stop()

	result, err := ticketCollection.DeleteOne(ct, bson.M{"_id": docID})
	if err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	g.JSON(http.StatusOK, result.DeletedCount)
}
