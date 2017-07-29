function RouteError(message){
  Error.apply(this, arguments)
  this.message = message
}

RouteError.prototype = new Error;

export default RouteError