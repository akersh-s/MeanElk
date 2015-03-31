package com.tempest.a

import akka.actor.ActorSystem
import akka.actor.{Actor, ActorLogging, Props}
import scala.concurrent.Future
import twitter4j.Status
import twitter4j.StatusDeletionNotice
import twitter4j.StatusListener
import twitter4j.StallWarning
import twitter4j.TwitterStreamFactory

object TwitterScraperActor {
  val props = Props[TwitterScraperActor]
  case object Start
}

class TwitterScraperActor extends Actor with ActorLogging {
  import TwitterScraperActor._
  def receive = {
    case Start => start()
  }
  
  def start() {
    log.info("Starting up the Twitter Scraper.")
    
    val twitterStream = new TwitterStreamFactory(Config.twitterConfig).getInstance
    twitterStream.addListener(TempestStatusListener)
    twitterStream.sample
  }
}

object TempestStatusListener extends StatusListener {
  val system = ActorSystem("MyActorSystem")
  var sentimentActor = system.actorOf(SentimentActor.props, "sentimentActor")
  
  def onStatus(status: Status) {
    sentimentActor ! new SentimentActor.TwitterMessage(status.getText)
  }
  def onDeletionNotice(statusDeletionNotice: StatusDeletionNotice) {}
  def onTrackLimitationNotice(numberOfLimitedStatuses: Int) {}
  def onException(ex: Exception) { ex.printStackTrace }
  def onScrubGeo(arg0: Long, arg1: Long) {}
  def onStallWarning(warning: StallWarning) {}
}