/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

const nodemailer = require('nodemailer');

/*
Class for sending mail using nodemailer module
 */
class SendMail {

  /**
   * [Sending an email]
   * @param  {[String]} dest [string with user's email]
   * @param  {[String]} link [string with token]
   * @param  {[String]} title [string with quiz's title]
   */
  static sendMail(dest, link, title) {

    /*
    Configuration for sending mail using google smtp
     */
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'fumseck07@gmail.com',
            pass: 'M9*;h+pCBXB3o4.S'
        }
    });

    /*
    Sending mail (can get informations with info variable)
     */
    let info = transporter.sendMail({
        from: '"Fumseck" <fumseck@corporation.com>',
        to: dest,
        subject: 'Your quiz link (' + title + ')',
        text: 'Your link for ' + title + ' : ' + link,
        html: 'Your link for ' + title + ' : <a href="' + link + '">' + link + '</a>'
    });
  }
}

module.exports = SendMail
