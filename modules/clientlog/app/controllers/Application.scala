package controllers.clientlog

import play.api._
import play.api.mvc._

import play.api.Play.current
import play.api.libs._
import play.api.libs.iteratee._
import play.api.libs.json._
import scala.language.reflectiveCalls
import utils._

import scala.concurrent.Future

// Reactive Mongo imports
import reactivemongo.api._

// Reactive Mongo plugin, including the JSON-specialized collection
import play.modules.reactivemongo.MongoController
import play.modules.reactivemongo.json.collection.JSONCollection

object Application extends Controller with MongoController {

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

  def angular(appName: String) = Action { implicit request =>
    Ok(views.txt.clientlog.angularHandler(appName))
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

  def collectionLogs: JSONCollection = db.collection[JSONCollection]("persons")

  def insert(json: JsValue) = {
    collectionLogs.insert(json)
  }

  def pullAll() = Action {
    val cursor: Cursor[JsObject] = collectionLogs.
      find(Json.obj()).
      cursor[JsObject]
    val futureLogsList: Future[List[JsObject]] = cursor.toList
    futureLogsList.map { logs =>
      logs.foreach { log =>
        println(log)
        channel.push(log)
      }
    }
    Ok
  }

}

object Assets extends controllers.AssetsBuilder
