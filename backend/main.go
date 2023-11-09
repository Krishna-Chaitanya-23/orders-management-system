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
	//C
	appRouter.POST("/order/new", endpoints.CreateOrder)
	//R
	appRouter.GET("/waiter/:waiterId", endpoints.FetchOrdersByWaiter)
	appRouter.GET("/orders/all", endpoints.FetchAllOrders)
	appRouter.GET("/order/:orderId/", endpoints.FetchOrderById)
	//U
	appRouter.PUT("/waiter/edit/:waiterId", endpoints.EditWaiter)
	appRouter.PUT("/order/edit/:orderId", endpoints.EditOrder)
	//D
	appRouter.DELETE("/order/remove/:orderId", endpoints.RemoveOrder)

	//this starts the server and allows it to listen to requests.
	appRouter.Run(":" + serverPort)
}
