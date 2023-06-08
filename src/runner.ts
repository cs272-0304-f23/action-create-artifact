import * as core from '@actions/core'

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
      }
    }
  }
}

export default Runner
