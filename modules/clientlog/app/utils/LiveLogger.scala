package utils

import play.api._
import play.api.mvc._
import play.api.libs.json._

import org.joda.time.LocalDateTime

case class LiveLogger(clazz: String) {

  protected val log = play.api.Logger(clazz)

  private def update(path: JsPath, value: JsValue): Reads[JsObject] = path.json.update(Reads.pure(value))

  def error(error: JsValue)(implicit request: RequestHeader) = {
    if (log.isErrorEnabled) {
      val errorFormated = error.transform(
        (__).json.update(Reads.pure(Json.obj(
          "ip" -> request.remoteAddress,
          "date" -> new LocalDateTime().toString(),
          "login" -> request.session.get("login").getOrElse("").toString
        )))
      ).get
      controllers.clientlog.Application.channel.push( errorFormated )
      controllers.clientlog.Application.insert( errorFormated )
      log.error(errorFormated.toString)
    }
  }

  def accesslog(accessLog: => JsValue) = {
    if (log.isTraceEnabled) {
      controllers.clientlog.Application.channel.push(accessLog)
      controllers.clientlog.Application.insert( accessLog )
      log.trace(accessLog.toString)
    }
  }

  def trace(message: => String, error: => Throwable) {
    if (log.isTraceEnabled) {
      log.trace(message, error)
    }
  }

  def trace(message: => String) {
    if (log.isTraceEnabled) {
      log.trace(message)
    }
  }

  def debug(message: => String, error: => Throwable) {
    if (log.isDebugEnabled) {
      log.debug(message, error)
    }
  }

  def debug(message: => String) {
    if (log.isDebugEnabled) {
      log.debug(message)
    }
  }

  def warn(message: => String, error: => Throwable) {
    if (log.isWarnEnabled) {
      log.warn(message, error)
    }
  }

  def warn(message: => String) {
    if (log.isWarnEnabled) {
      log.warn(message)
    }
  }

  def error(message: => String, error: => Throwable) {
    if (log.isErrorEnabled) {
      log.error(message, error)
    }
  }

  def error(message: => String) {
    if (log.isErrorEnabled) {
      log.error(message)
    }
  }

  def info(message: => String, error: => Throwable) {
    if (log.isInfoEnabled) {
      log.info(message, error)
    }
  }

  def info(message: => String) {
    if (log.isInfoEnabled) {
      log.info(message)
    }
  }

}

object LiveLogger {
  def apply(): LiveLogger = LiveLogger("application")
}
