package com.tempest.a

import akka.actor.{Actor, ActorLogging, Props}
import scalaj.http.Http

import com.tempest.a.transmitter.TransmitterActor
import com.tempest.a.api.MainActors
//import scala.concurrent.{future, blocking, Future, Await, ExecutionContext.Implicits.global}
import spray.json._
import DefaultJsonProtocol._

object StockPriceActor {
  val props = Props[StockPriceActor]
  case object UpdateStocks
}

class StockPriceActor extends Actor with ActorLogging {
	import StockPriceActor._

	def receive = {
		case UpdateStocks => updateStocks()
	}

	def updateStocks() {
		val url = "http://dev.markitondemand.com/Api/v2/Quote/json"
		val apple = Http(url).param("symbol", "AAPL").asString.body.parseJson;
		val google = Http(url).param("symbol", "GOOG").asString.body.parseJson;
		val ms = Http(url).param("symbol", "MSFT").asString.body.parseJson;

		ApplicationMain.transmitterActor ! TransmitterActor.Send("stockprice", JsArray(apple, google, ms))
	}
}

//case class MarkItOnDemandObj(Status: String, Name: String, Symbol: String, LastPrice: Double, Change: Double, ChangePercent: Double, Timestamp: Date
//	MSDate: Double, MarketCap: Double, Volume: Double, ChangeYTD: Double, ChangePercentYTD: Double, High: Double, Low: Double, Open: Double)