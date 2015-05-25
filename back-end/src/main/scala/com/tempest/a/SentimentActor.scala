package com.tempest.a

import akka.actor.{Actor, ActorLogging, Props}
import edu.stanford.nlp.io._
import edu.stanford.nlp.ling._
import edu.stanford.nlp.pipeline._
import edu.stanford.nlp.trees._
import edu.stanford.nlp.util._
import edu.stanford.nlp.sentiment._
import java.util.Properties
import scala.collection.JavaConversions._
import spray.json._

import com.tempest.a.transmitter.TransmitterActor
import com.tempest.a.api.MainActors

object SentimentActor {
  val props = Props[SentimentActor]
  val annotators = new Properties
  annotators.setProperty("annotators", "tokenize, ssplit, pos, lemma, parse, sentiment")
  val pipeline = new StanfordCoreNLP(annotators)
  case class TwitterMessage(message: String) 
  
  def toAscii(hex: String) = {
    import javax.xml.bind.DatatypeConverter
    new String(DatatypeConverter.parseHexBinary(hex))
  }
}

class SentimentActor extends Actor with ActorLogging {
  import SentimentActor._
  
  def receive = {
    case TwitterMessage(message) => processMessage(message)
  }
  
  def processMessage(message: String) {
  	val annotation = SentimentActor.pipeline.process(message)
  	val sentences = annotation.get(classOf[CoreAnnotations.SentencesAnnotation])
  	sentences.toList.foreach { sentence =>
  		val sentiment = sentence.get(classOf[SentimentCoreAnnotations.ClassName]).toString
      val sentimentScore = determineSentiment(sentiment.toString)
      val json = SentimentMessage(sentence.toString, sentimentScore).toJson
      ApplicationMain.transmitterActor ! TransmitterActor.Send("sentiment", json)
  	}
  }

  def determineSentiment(sentimentResponse: String): Integer ={
    if (sentimentResponse == "Positive") {
      return 100
    }
    else if (sentimentResponse == "Negative") {
      return 0
    }
    else {
      return 50
    }
  }
}

case class SentimentMessage(sentence: String, sentiment: Integer) {
  def toJson:JsValue = JsArray(JsString(sentence), JsNumber(sentiment))
}