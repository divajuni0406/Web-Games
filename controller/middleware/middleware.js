exports.errorPage = (req, res) => {
    res.status(404);
    res.send("<h1>404</h1>");
  }