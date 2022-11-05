const nodemailer = require('nodemailer')


const sendMailTest = async options => {
  // creating a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
      user: 'ta8600419@gmail.com',
      pass: 'mrujmfrcayvxwfeo'
    }
    // activate in Gmail 'less secure app option'
  })

  const mailOptions = {
    from: 'ta8600419`@gmail.com',
    // to: 'avinashbabu2312@gmail.com, arunkumarakit123@gmail.com',
    to: 'avinashbabu2312@gmail.com',
    // cc: 'arunkumarakit123@gmail.com',
    // to: 'arunkumarakit123@gmail.com',
    subject: 'testing nodemailer',
    text: 'Hi from the nodeMailer',
    // html:
  }

  await transporter.sendMail(mailOptions)

}

module.exports = sendMailTest
