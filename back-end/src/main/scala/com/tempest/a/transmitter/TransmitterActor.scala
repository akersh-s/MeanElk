package com.tempest.a.transmitter

import akka.actor.{Actor, ActorLogging, Props}
import scala.collection.mutable
import com.tempest.a.websocket._
import spray.json._

object TransmitterActor {
	val props = Props[TransmitterActor]
	sealed trait TransmitterMessage
	case class Send(t: String, message: JsValue) extends TransmitterMessage
	case class Unregister(ws : WebSocket) extends TransmitterMessage
}

class TransmitterActor extends Actor with ActorLogging {
	var clients = mutable.ListBuffer[WebSocket]()

	override def receive = {
		case WebSocket.Open(ws) =>
			if (ws != null) {
				clients += ws
				log.debug("Registered {}", ws.path)
			}
		case TransmitterActor.Send(t, message) =>
			if (message != null) {
				//log.info(message) 
				for (client <- clients) {
					client.send(JsObject(
						"type" -> JsString(t),
						"value" -> message
					).toString)
				}
			}
		case WebSocket.Close(ws, code, reason) =>
			self ! TransmitterActor.Unregister(ws)
		case WebSocket.Error(ws, ex) =>
			self ! TransmitterActor.Unregister(ws)
		case TransmitterActor.Unregister(ws) =>
			if (ws != null) {
				clients -= ws
				log.debug("Unregistered {}", ws.path)
			}
		case other =>
			log.warning("Received {}", other)
	}
}