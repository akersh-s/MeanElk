name := """back-end"""

version := "1.0"

scalaVersion := "2.11.5"

resolvers += "Spray" at "http://repo.spray.io"
val sprayV = "1.3.2"
libraryDependencies ++= Seq(

  "com.typesafe.akka" %% "akka-actor" % "2.3.9",
  "com.typesafe.akka" %% "akka-testkit" % "2.3.9" % "test",
  "org.scalatest" %% "scalatest" % "2.2.4" % "test",
  "org.twitter4j" % "twitter4j-stream" % "4.0.2",
  "org.facebook4j" % "facebook4j-core" % "2.2.2",
  "org.scala-lang.modules" %% "scala-async" % "0.9.2",
  "org.scalaj" %% "scalaj-http" % "1.1.4",
  "edu.stanford.nlp" % "stanford-corenlp" % "3.5.1",
  "edu.stanford.nlp" % "stanford-corenlp" % "3.5.1" classifier "models",
  "com.wandoulabs.akka" %% "spray-websocket" % "0.1.4",
  
  "io.spray"            %%  "spray-json"            % "1.3.1",
  "io.spray"            %%  "spray-can"             % sprayV,
  "io.spray"            %%  "spray-routing"         % sprayV
)

fork in run := true