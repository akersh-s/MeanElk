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
  	val props = new Properties
  	props.setProperty("annotators", "tokenize, ssplit, pos, lemma, parse, sentiment")
  	val pipeline = new StanfordCoreNLP(props)
  	val annotation = pipeline.process(message)
  	val sentences = annotation.get(classOf[CoreAnnotations.SentencesAnnotation])
  	sentences.toList.foreach { sentence =>
  		val sentiment = sentence.get(classOf[SentimentCoreAnnotations.ClassName])
  		log.info(sentiment.toString() + "\t" + sentence)
  	}
  }
}