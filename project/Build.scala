import sbt._
import Keys._
import play.Project._

object BuildSettings {
  val buildOrganization = "com.zenexity"
  val buildVersion      = "0.1-SNAPSHOT"
  val playVersion       = "2.1.2"

  val local = Resolver.url("Local ivy2 Repository", url("file://" + Path.userHome.absolutePath + "/.ivy2/local"))(Resolver.ivyStylePatterns)
  val typesafe = "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"
  val sonatype = "Sonatype repository" at "https://oss.sonatype.org/content/repositories/releases/"
  val sonatypeSS = "Sonatype repository Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots/"

  val buildSettings = Defaults.defaultSettings ++ Seq (
    organization := buildOrganization,
    version      := buildVersion,
    scalaVersion := "2.10.0",
    resolvers    += local,
    resolvers    += typesafe,
    resolvers    += sonatype,
    resolvers    += sonatypeSS,
    initialize   ~= { _ =>
      System.setProperty("assets.dir", "./assets")
    },
    scalacOptions ++= Seq("-unchecked", "-deprecation", "-feature"),
    parallelExecution in Test := false
  )
}

object ApplicationBuild extends Build {

  val main = play.Project("app", BuildSettings.buildVersion, path = file("."), settings = BuildSettings.buildSettings).settings(

  ).aggregate(clientlog).dependsOn(clientlog)

  lazy val clientlog = play.Project("clientlog", BuildSettings.buildVersion, path = file("modules/clientlog"), settings = BuildSettings.buildSettings).settings(
  )

}
