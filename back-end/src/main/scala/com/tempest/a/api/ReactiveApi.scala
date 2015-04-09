package com.tempest.a.api


import com.tempest.a.transmitter._
import com.tempest.a.websocket._

import akka.actor.{ ActorSystem, Props }
import akka.event.Logging.InfoLevel
import scala.reflect.ClassTag
import spray.http.{ HttpRequest, StatusCodes }
import spray.routing.{ Directives, RouteConcatenation }
import spray.routing.directives.LogEntry

trait AbstractSystem {
	implicit def system : ActorSystem
}

trait ReactiveApi extends RouteConcatenation with Directives with AbstractSystem {
	this: MainActors =>
	private def showReq(req: HttpRequest) = LogEntry(req.uri, InfoLevel)

  val wsService = system.actorOf(Props(new RootService[WebSocketServer](wsroutes)), "wss")
  lazy val wsroutes = logRequest(showReq _) {
    new TransmitterService(transmitterActor).wsroute ~
    complete(StatusCodes.NotFound)
  }
}