package com.tempest.a.transmitter

import com.tempest.a.websocket.WebSocket
import akka.actor.{ ActorRef, ActorSystem }
import spray.routing.Directives
import spray.http.HttpHeaders.RawHeader

class TransmitterService(transmitterActor: ActorRef)(implicit system: ActorSystem) extends Directives {
	lazy val wsroute =
		(pathPrefix("transmitter") & pathEndOrSingleSlash) {
			respondWithHeader(RawHeader("Access-Control-Allow-Origin", "*")) {
				implicit ctx =>
					ctx.responder ! WebSocket.Register(ctx.request, transmitterActor, true)
			}
		}
}

//transmitter/ws/?EIO=3&transport=polling&t=1428558894984-0