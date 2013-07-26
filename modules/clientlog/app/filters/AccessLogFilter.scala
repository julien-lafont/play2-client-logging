package clientlog.filters

import org.joda.time.LocalDateTime
import play.api._
import play.api.mvc._

import play.api.libs.json._
import play.api.libs.functional.syntax._

import utils.LiveLogger

object AccessLogFilter extends Filter {

  def apply(next: (RequestHeader) => Result)(request: RequestHeader) = {

    val accessJson =
      Json.obj(
        "useragent" -> request.headers.get("User-Agent"),
        "message" -> "",
        "url" -> request.path,
        "line" -> "",
        "level" -> "trace",
        "ip" -> request.remoteAddress,
        "date" -> new LocalDateTime().toString(),
        "login" -> request.session.get("login").getOrElse("").toString
      )

    if (!(request.path.length >= 7 && request.path.substring(0,7) == "/assets") &&
      !(request.path.length >= 5 && request.path.substring(0,5) == "/logs") &&
      !(request.path.length >= 12 && request.path.substring(0,12) == "/favicon.ico") ) {

      LiveLogger("access").accesslog(accessJson)
    }

    next(request)
  }
}
