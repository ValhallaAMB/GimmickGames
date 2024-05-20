
const renderIndex = (req, res) => {
  res.render("index", { user: req.user }); 
};

const renderDashboard = (req, res) => {
  res.render("index", {
    user: req.user, 
    name: req.user.name,
    email: req.user.email,
    password: req.user.password,
  });
};

module.exports = {
  renderIndex,
  renderDashboard,
};
