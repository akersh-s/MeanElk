package com.tempest.a.transmitter

import com.tempest.a.websocket.WebSocket
import akka.actor.{ ActorRef, ActorSystem }
import spray.routing.Directives

class TransmitterService(transmitterActor: ActorRef)(implicit system: ActorSystem) extends Directives {
	lazy val wsroute =
		pathPrefix("transmitter") {
			path("ws") {
				implicit ctx =>
					ctx.responder ! WebSocket.Register(ctx.request, transmitterActor, true)
			}
		}
}