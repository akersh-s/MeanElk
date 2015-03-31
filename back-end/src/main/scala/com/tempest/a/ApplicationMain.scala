package com.tempest.a

import akka.actor.ActorSystem

object ApplicationMain extends App {
  val system = ActorSystem("MyActorSystem")
  var twitterScraperActor = system.actorOf(TwitterScraperActor.props, "twitterScraperActor")
  twitterScraperActor ! TwitterScraperActor.Start
  // This example app will ping pong 3 times and thereafter terminate the ActorSystem - 
  // see counter logic in PingActor
  system.awaitTermination()
}