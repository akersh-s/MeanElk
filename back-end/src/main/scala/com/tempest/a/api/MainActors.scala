package com.tempest.a.api

import com.tempest.a._
import com.tempest.a.transmitter.TransmitterActor

trait MainActors {
	this : AbstractSystem => 

	lazy val twitterScraperActor = system.actorOf(TwitterScraperActor.props, "twitterScraperActor")
	lazy val transmitterActor = system.actorOf(TransmitterActor.props, "transmitterActor")
	lazy val sentimentActor = system.actorOf(SentimentActor.props, "sentimentActor")
	lazy val stockPriceActor = system.actorOf(StockPriceActor.props, "stockPriceActor")
}