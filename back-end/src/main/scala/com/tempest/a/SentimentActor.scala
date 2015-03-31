package com.tempest.a
import akka.actor.{Actor, ActorLogging, Props}

object SentimentActor {
  val props = Props[SentimentActor]
  
  case class TwitterMessage(message: String) 
}

class SentimentActor extends Actor with ActorLogging {
  import SentimentActor._
  
  def receive = {
    case TwitterMessage(message) => processMessage(message)
  }
  
  def processMessage(message: String) {
    log.info(message)
  }
}