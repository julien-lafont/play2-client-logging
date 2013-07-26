package utils

import play.api._
import play.api.mvc._
import play.api.libs.json._

import org.joda.time.LocalDateTime

case class LiveLogger(clazz : String) {
  protected val log = play.api.Logger(clazz)

  def update(path: JsPath, value: JsValue): Reads[JsObject] = path.json.update(Reads.pure(value))

  def error( error: JsValue)(implicit request : RequestHeader) = {
    val errorFormated = error.transform(
      (__).json.update(Reads.pure(Json.obj("ip" -> request.remoteAddress))) andThen
      (__).json.update(Reads.pure(Json.obj("date" -> new LocalDateTime().toString()))) andThen
      (__).json.update(Reads.pure(Json.obj("login" -> request.session.get("login").getOrElse("").toString)))
    ).get
    controllers.clientlog.Application.channel.push( errorFormated )
    log.error(errorFormated.toString)
  }

  def trace( accessLog :JsValue) = {
    controllers.clientlog.Application.channel.push( accessLog )
    log.trace(accessLog.toString)
  }
}

object LiveLogger {
  def apply() : LiveLogger = LiveLogger("application")
}
