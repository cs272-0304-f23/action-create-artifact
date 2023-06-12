import * as core from "@actions/core"
import * as github from "@actions/github"

import * as luxon from "luxon"
const zone = 'America/Los_Angeles';
const eod = 'T23:59:59';
luxon.Settings.defaultZone = zone;

class Runner {
  score = ''
  pointsEarned = 0
  pointsPossible = 100

  constructor() {
    this.getInputs()
  }

  /**
   * Runs the action. 
   * For now, we just print out the inputs to ensure that the action is working.
   */
  async run() {
    core.info(`Score: ${this.score}`)
    core.info(`Points earned: ${this.pointsEarned}`)
    core.info(`Points possible: ${this.pointsPossible}`)

    const submissionDate = this.parseSubmissionDate()
    this.checkSubmissionDate(submissionDate)
  }

  /**
   * Parses GitHub Actions inputs from environment
   */
  private getInputs() {
    const score = core.getInput('score')
    if (score) {
      this.score = score

      // Parse score into points earned and points possible (e.g. 10/10). If the score is not in this format, 
      // default to 0/100.
      let fields = score.split('/')
      if(fields.length === 2) {
        let [earnedStr, possibleStr] = fields
        this.pointsEarned = parseInt(earnedStr)
        this.pointsPossible = parseInt(possibleStr)
      } else {
        throw new Error(`Score input is not in the correct format. Expected format: 80/100. Actual: ${score}`)
      }
    }
  }

  /**
   * Parses the submission date from the GitHub Actions environment
   * @returns The submission date
   * @throws An error if the submission date is not in the correct format
   */
  private parseSubmissionDate(): luxon.DateTime {
    let submissionDate: luxon.DateTime | undefined;
    
    console.log('Parsing submission date from GitHub context...')
    switch(github.context.eventName) {
      case 'workflow_dispatch':
      case 'push':
        // pushed_at is a timestamp for this commit
        const pushed = github.context.payload.repository?.pushed_at;
        if(pushed) {
          submissionDate = luxon.DateTime.fromSeconds(parseInt(pushed))
        } else {
          console.log(`\tPayload's repository does not contain pushed_at timestamp. Payload.repository: ${JSON.stringify(github.context.payload.repository)}`)
          console.log(`\tUsing current time as submission date.`)
          submissionDate = luxon.DateTime.now()
        }
        break;
    }

    // check that we were able to parse the submission date
    if(!submissionDate) {
      throw new Error(`Could not parse submission date from GitHub context. Event name: ${github.context.eventName}`)
    }
    console.log(`\tSubmission date: ${submissionDate}`)
    return submissionDate
  }

  /**
   * Checks the given submission date and calculates the late penalty if applicable
   */
  private checkSubmissionDate(submittedDate: luxon.DateTime){
    // TODO
    console.log(`Checking submission date: ${submittedDate.toString()}`)
  }
}

export default Runner
