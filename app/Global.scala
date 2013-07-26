
import play.api._
import play.api.mvc._
import play.api.libs.json._
import utils._
import org.joda.time.LocalDateTime

// Note: this is in the default package.
object Global extends GlobalSettings {

  override def onRouteRequest(request: RequestHeader): Option[Handler] = {
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
      !(request.path.length >= 5 && request.path.substring(0,5) == "/logs")) {

      LiveLogger("access").trace(accessJson)
    }
    super.onRouteRequest(request)
  }

}
