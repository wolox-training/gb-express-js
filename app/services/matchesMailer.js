const errors = require('../errors'),
  emailSender = require('./emailSender'),
  matchesService = require('./matches');

const matchesArrayToHtml = (array) => {
  let html = '';
  array.forEach((element) => {
    html += `<ul>
    <li> <b>user_id:</b> ${element.user_id} </li>
    <li> <b>game_id:</b> ${element.game_id} </li>
    <li> <b>assertions:</b> ${element.assertions} </li>
    </ul>
    </hr>`;
  });
  return html;
};

exports.sendUserHistory = (reqUser, userId) => {
  return matchesService.getUserHistory(userId).then((history) => {
    const mailOptions = {
      from: '"WoloxLand-Dev" <431fd78de2-a99c67@inbox.mailtrap.io>',
      to: reqUser.email,
      subject: `Matches list for user_id: ${userId}`,
      html: matchesArrayToHtml(history)
    };
    emailSender.sendMail(mailOptions);
  }).catch((err) => {
    throw errors.defaultError(err);
  });
};
