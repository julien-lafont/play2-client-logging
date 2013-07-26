
import clientlog.filters.AccessLogFilter
import play.api.mvc._

object Global extends WithFilters(AccessLogFilter) {

}
