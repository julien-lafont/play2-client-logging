package controllers.clientlog

import play.api._
import play.api.mvc._

import play.api.Play.current
import play.api.libs._
import play.api.libs.iteratee._
import play.api.libs.json._
import scala.language.reflectiveCalls
import utils._

object Application extends Controller {

  val (output, channel) = Concurrent.broadcast[JsValue]

  def index = Action {
    Ok(views.html.clientlog.index(current))
  }

  def script = Action { implicit request =>
    val config = Play.current.configuration.getConfig("clientlog").get
    val enabled = config.getBoolean("enabled").getOrElse(true)
    val interval = config.getInt("interval").getOrElse(10)
    val firstErrorOnly = config.getBoolean("firstErrorOnly").getOrElse(true)
    val url = controllers.clientlog.routes.Application.pushLog.absoluteURL()

    Ok(views.txt.clientlog.script(url, enabled, interval, firstErrorOnly))
      .as(JAVASCRIPT)
  }

  def live = Action {
    Ok.feed(
      output &> EventSource[JsValue]() ><> Enumeratee.map(_.getBytes("UTF-8"))
    ).as("text/event-stream")
  }

  def pushLog = Action(parse.json) { implicit request =>
    request.body.as[JsArray].value.foreach { error =>
      LiveLogger("client").error(error)
    }
    Created
  }

}

object Assets extends controllers.AssetsBuilder
