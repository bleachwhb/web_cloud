// This is required for using Parse

function resetPassword(email, redirectUrl) {
  Parse.User.requestPasswordReset(email, {
    success: function () {
      window.location.replace(redirectUrl);
    },
    error: function (error) {
      // Show the error message somewhere
      alert("Error: " + error.code + " " + error.message);
    }
  });
  event.preventDefault();
}