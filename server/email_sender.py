import smtplib
import dotenv
dotenv.load() 

def send(message, url):
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(dotenv.get('SENDER'), dotenv.get('PASSWORD'))
        if isinstance(message, list):
            subject = message[0] + " Price change!"
            body = message[0] +" new price is " + message[1] +'\n' + "Prior price was " + message[2] + '\n' + 'Get it here: \n' + url 
        else:
            subject = message
            body = message + ": " + url
            # print(message)
        msg = f"Subject: {subject}\n\n{body}"
        server.sendmail(
            dotenv.get('SENDER'),
            dotenv.get('RECIPIENT'),
            msg
        )
        # print("email has been sent")
        server.quit()