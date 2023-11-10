package main

import (
	"backend/endpoints"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	serverPort := os.Getenv("PORT")

	if serverPort == "" {
		serverPort = "8000"
	}

	appRouter := gin.New()
	appRouter.Use(gin.Logger())

	appRouter.Use(cors.Default())

	// these are the API endpoints
	//Create
	appRouter.POST("/ticket/new", endpoints.CreateTicket)
	//Read
	//appRouter.GET("/attendant/:attendantId", endpoints.FetchTicketsByAttendant)
	//appRouter.GET("/tickets/all", endpoints.FetchAllTickets)
	//appRouter.GET("/ticket/:ticketId/", endpoints.FetchTicketById)
	//Update
	//appRouter.PUT("/attendant/edit/:attendantId", endpoints.EditAttendant)
	//appRouter.PUT("/ticket/edit/:ticketId", endpoints.EditTicket)
	//Delete
	//appRouter.DELETE("/ticket/remove/:ticketId", endpoints.RemoveTicket)

	//this starts the server and allows it to listen to requests.
	appRouter.Run(":" + serverPort)
}
