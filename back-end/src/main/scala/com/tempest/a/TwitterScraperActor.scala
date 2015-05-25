package com.tempest.a

import akka.actor.ActorSystem
import akka.actor.{Actor, ActorLogging, Props}
import scala.concurrent.Future
import twitter4j._

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
    
    //val fq = new FilterQuery()
    //fq.language(Array("en"))
    val twitterStream = new TwitterStreamFactory(Config.twitterConfig).getInstance
    twitterStream.addListener(TempestStatusListener)
    //twitterStream.filter(fq)
    twitterStream.sample
  }
}

object TempestStatusListener extends StatusListener {  
  def onStatus(status: Status) {
    ApplicationMain.sentimentActor ! new SentimentActor.TwitterMessage(status.getText)
  }
  def onDeletionNotice(statusDeletionNotice: StatusDeletionNotice) {}
  def onTrackLimitationNotice(numberOfLimitedStatuses: Int) {}
  def onException(ex: Exception) { ex.printStackTrace }
  def onScrubGeo(arg0: Long, arg1: Long) {}
  def onStallWarning(warning: StallWarning) {}
}