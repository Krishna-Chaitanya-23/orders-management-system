package schemas

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Ticket struct {
	TicketID  primitive.ObjectID `bson:"_id"`
	Item      *string            `json:"item"`
	ItemPrice *float64           `json:"itemPrice"`
	Attendant *string            `json:"attendant"`
	Table     *string            `json:"table"`
}
