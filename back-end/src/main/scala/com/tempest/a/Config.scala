package com.tempest.a

object Config {
  val twitterConfig = new twitter4j.conf.ConfigurationBuilder()
    .setOAuthConsumerKey("HbwAT6fwbK0YG1jzlxyAo2qv4")
    .setOAuthConsumerSecret("tGpSEP01y5b4EjYmMT7Ugm3ACS9pH6BUqMhitV3SKPy35LTOSd")
    .setOAuthAccessToken("418183945-lsztPrOGRqTwo7xVK4pDoIc1ScRyHjw42BXG1L0m")
    .setOAuthAccessTokenSecret("kNq5vKcYRFSusyguEOmgDOpHWUemwdCekP6SWnqiqGIAm")
    .build

  import com.typesafe.config.ConfigFactory
 
  private val config = ConfigFactory.load
  config.checkValid(ConfigFactory.defaultReference)

  lazy val host = config.getString("a.host")
  lazy val portHttp = config.getInt("a.ports.http")
  lazy val portTcp = config.getInt("a.ports.tcp")
  lazy val portWs = config.getInt("a.ports.ws")
}