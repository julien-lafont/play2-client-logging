package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  def index(login: Option[String] = None) = Action { request =>
    val result = Ok(views.html.index())
    login match {
      case Some(login) => result.withSession("login" -> login)
      case None => result
    }
  }

  def p1 = Action {
    Ok(views.html.page1())
  }

  def p2 = Action {
    Ok(views.html.page2())
  }

  def p3 = Action {
    Ok(views.html.page3())
  }

  def p4 = Action {
    Ok(views.html.page4())
  }

  def p5 = Action {
    Ok(views.html.page5())
  }
}
