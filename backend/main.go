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
	appRouter.GET("/attendant/:attendant", endpoints.FetchTicketsByAttendant)
	appRouter.GET("/tickets", endpoints.FetchAllTickets)
	appRouter.GET("/ticket/:id/", endpoints.FetchTicketById)
	//Update
	appRouter.PUT("/attendant/edit/:id", endpoints.EditAttendant)
	appRouter.PUT("/ticket/edit/:id", endpoints.EditTicket)
	//Delete
	appRouter.DELETE("/ticket/remove/:id", endpoints.RemoveTicket)

	//this starts the server and allows it to listen to requests.
	appRouter.Run(":" + serverPort)
}
