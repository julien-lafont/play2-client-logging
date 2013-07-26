package utils

import play.api._
import play.api.mvc._
import play.api.libs.json._

import org.joda.time.LocalDate

object LiveLogger {
  protected val log = play.api.Logger(this.getClass())

  def update(path: JsPath, value: JsValue): Reads[JsObject] = path.json.update(Reads.pure(value))

  def error( error: JsValue)(implicit request : RequestHeader) = {
    val errorFormated = error.transform(
      (__).json.update(Reads.pure(Json.obj("ip" -> request.remoteAddress))) andThen
      (__).json.update(Reads.pure(Json.obj("date" -> new LocalDate())))
    ).get
    controllers.clientlog.Application.channel.push( errorFormated)
    log.error(errorFormated.toString)
  }
}
