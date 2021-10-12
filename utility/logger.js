const slack = require('slack-notify')(process.env.SLACK_WEBHOOK_URL);

class Logger {

    Report = async report => {
        this.Slack(report) // report to slack
    }

    Slack = async ({message, service}) => {
        slack.send({
            channel: '#checkman-logger',
            text: `${service} => ${message}`,
            username: 'ena-node-bot',
            icon_url: 'https://earnathon.com/static/media/yellow-06.7e9ef266.svg'
        });
    }

}

module.exports = new Logger();