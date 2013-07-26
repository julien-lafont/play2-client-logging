package utils

import play.api.libs.json._

object LiveLogger {
  protected val log = play.api.Logger(this.getClass())

  def error( error: JsValue) = {
    controllers.clientlog.Application.channel.push( error)
    log.error(error.toString)
  }
}
