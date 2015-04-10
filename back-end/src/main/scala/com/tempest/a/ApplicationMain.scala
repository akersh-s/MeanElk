package com.tempest.a

import akka.actor.{ ActorSystem, PoisonPill }
import akka.io.{ IO, Tcp }
import spray.can.Http
import spray.can.server.UHttp
import com.tempest.a
import com.tempest.a.api._

object ApplicationMain extends App with MainActors with ReactiveApi {
  implicit lazy val system = ActorSystem("tempest-system")
  
  //Setup WebSockets
  sys.addShutdownHook({ system.shutdown })
  
  // Since the UTttp extension extends from Http extension, it starts an actor whose name will later collide with the Http extension.
  system.actorSelection("/user/IO-HTTP") ! PoisonPill
  //IO(Tcp) ! Tcp.Bind(socketService, new InetSocketAddress(Configuration.host, Configuration.portTcp))
  // We could use IO(UHttp) here instead of killing the "/user/IO-HTTP" actor
  IO(UHttp) ! Http.Bind(wsService, Config.host, Config.portWs)
  //IO(Http) ! Http.Bind(wsService, Config.host, Config.portWs)

  twitterScraperActor ! TwitterScraperActor.Start
  // This example app will ping pong 3 times and thereafter terminate the ActorSystem - 
  // see counter logic in PingActor
  system.awaitTermination()
}