export function setHeaders(headers) {
  andThen(function() {
    $.ajaxSetup({ headers: headers });
  });
}
