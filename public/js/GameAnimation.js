/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

class GameAnimation {
  constructor() {
    this.cardsEls = document.getElementsByClassName('uk-card')
    this.countdownNumberEl = document.getElementById('countdown-number')
    this.timerSVGEl = document.getElementById('timer-svg')
    this.countdownSvgCircleEl = document.getElementById('timer-svg--circle')
    this.countdownEl = document.getElementById('countdown')
    this.transitionWaitEl = document.getElementById('transition-wait')
    this.m16El = document.getElementById('m16')
    this.waitText = "Préparez vous pour la prochaine question"
  }

  /**
   * [addQuestionAnimation Animates question cards]
   */
  addQuestionAnimation() {
    for (let cardEl of this.cardsEls) {
      cardEl.classList.add('uk-animation-scale-up')
    }
    setTimeout(() => this.removeQuestionAnimation(), 500)
  }

  /**
   * [removeQuestionAnimation Removes question card's animation]
   * @return {[type]} [description]
   */
  removeQuestionAnimation() {
    for (let cardEl of this.cardsEls) {
      cardEl.classList.remove('uk-animation-scale-up')
    }
  }

  /**
   * [onTick Refreshes clock countdown, add a stressing motion at the 5 last seconds]
   * @param  {[Integer]} count [The actual timer's countdown]
   */
  onTick(count) {
    this.countdownNumberEl.textContent = count
    if(count <= 5) {
      this.addStressMotion()
    }
  }

  /**
   * [addStressMotion Set the timer red and adds a shaking motion]
   */
  addStressMotion() {
    this.countdownEl.classList.add('uk-animation-shake')
    setTimeout(() => { this.countdownEl.classList.remove('uk-animation-shake') }, 100)
    this.countdownNumberEl.style.color = "#e74c3c"
    this.countdownSvgCircleEl.style.stroke = "#e74c3c"
  }

  /**
   * [onSync When timers are synchronized, resets the display]
   * @param  {[Integer]} countdown [Start countdown]
   */
  onSync(countdown) {
    this.countdownNumberEl.textContent = countdown
    this.timerSVGEl.style.animationDuration =  countdown + 's'
    this.countdownNumberEl.style.color = "#333"
    this.countdownSvgCircleEl.style.stroke = "#333"
  }

  removeNodesChild(node) {
    while(node.firstChild) {
      node.removeChild(node.firstChild)
    }
  }

  /**
   * [addStartMotion Animation when game is starting]
   */
  addStartMotion() {
    let ml4 = {}
    ml4.opacityIn = [0,1]
    ml4.scaleIn = [0.2, 1]
    ml4.scaleOut = 3
    ml4.durationIn = 800
    ml4.durationOut = 600
    ml4.delay = 500

    anime.timeline({loop: false})
    .add({
      targets: '.ml4 .letters-1',
      opacity: ml4.opacityIn,
      scale: ml4.scaleIn,
      duration: ml4.durationIn
    }).add({
      targets: '.ml4 .letters-1',
      opacity: 0,
      scale: ml4.scaleOut,
      duration: ml4.durationOut,
      easing: "easeInExpo",
      delay: ml4.delay
    }).add({
      targets: '.ml4 .letters-2',
      opacity: ml4.opacityIn,
      scale: ml4.scaleIn,
      duration: ml4.durationIn
    }).add({
      targets: '.ml4 .letters-2',
      opacity: 0,
      scale: ml4.scaleOut,
      duration: ml4.durationOut,
      easing: "easeInExpo",
      delay: ml4.delay
    }).add({
      targets: '.ml4 .letters-3',
      opacity: ml4.opacityIn,
      scale: ml4.scaleIn,
      duration: ml4.durationIn
    }).add({
      targets: '.ml4 .letters-3',
      opacity: 0,
      scale: ml4.scaleOut,
      duration: ml4.durationOut,
      easing: "easeInExpo",
      delay: ml4.delay
    }).add({
      targets: '.ml4',
      opacity: 0,
      duration: 500,
      delay: 500
    })
  }

  /**
   * [addWaitMotion Animation between questions]
   */
  addWaitMotion() {
    let spanTextWrapper = document.createElement('span')
    spanTextWrapper.id = 'text-wrapper'
    spanTextWrapper.classList.add('text-wrapper')
    let span = document.createElement('span')
    span.classList.add('letters')
    span.textContent = this.waitText
    spanTextWrapper.appendChild(span)
    spanTextWrapper.innerHTML = spanTextWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>")
    this.m16El.appendChild(spanTextWrapper)

    let waitAnimation = anime.timeline({loop: false, autoplay: false})

    waitAnimation.add({
      targets: '.ml6 .letter',
      translateY: ["1.1em", 0],
      translateZ: 0,
      duration: 750,
      delay: (el, i) => 50 * i
    }).add({
      targets: '.ml6',
      opacity: [1, 0],
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    })

    waitAnimation.play()

    setTimeout(() => this.removeNodesChild(this.m16El), 5000)
    this.m16El.style.opacity = 1
  }

  /**
   * [addLoadMotion Animation when client should wait]
   */
  addLoadMotion() {
    anime.timeline({loop: true})
    .add({
      targets: '.dots .dot',
      translateY: [0, 20, 0],
      backgroundColor: ['#48dbfb', '#0abde3'],
      borderRadius: ['0%', '50%', '0%'],
      duration: 1000,
      delay: (el, i) => 333 * i
    })
  }

}
