/**
 * Authors : Romain Capocasale, Vincent Moulin and Jonas Freiburghaus
 * Date : August and September 2019
 * Projet name : Fumseck
 * Class : INF2dlm-A
 * Course : Project P2, Summer HES
 */

document.addEventListener('DOMContentLoaded', () => {
  const socket = io()

  let questionDisplayer = new QuestionDisplayer()
  let gameAnimation = new GameAnimation()
  let pageToggler = new PageToggler()

  let pseudo = document.getElementById('pseudo')
  let gameId = document.getElementById('gameId')
  let nbPlayer = document.getElementById('nbPlayer')

  let gameSoundPlayer = new GameSoundPlayer(pseudo === null)

  let scoreDisplayer = new ScoreDisplayer()
  let quizResponse = new QuizResponse(socket, gameId.value, gameSoundPlayer)

  //display player answered
  let quizLivePlayerAnswered = new QuizLivePlayerAnswered(socket, nbPlayer, pseudo)
  quizLivePlayerAnswered.listenPlayerAnswered()

  if(pseudo) {
    quizResponse.setPseudo(pseudo.value)

    let jokerManager = new JokerManager(socket, gameId.value, pseudo.value)
    jokerManager.clickOnJokerButton()
    jokerManager.listenRemovedPropositions();
  }

  socket.on('next_question', (data) => {
    //clean player answered info
    quizLivePlayerAnswered.cleanScreen()
    questionDisplayer.displayNext(data.question, data.count, data.nbQuestion)
    gameAnimation.addQuestionAnimation()
    quizResponse.resetCards()
  })

  socket.on('tick', (data) => {
    gameAnimation.onTick(data.countdown)
  })

  socket.on('sync', (data) => {
    pageToggler.togglePlay()
    gameAnimation.onSync(data.countdown)
    gameSoundPlayer.decreaseJingleVolume()
    gameSoundPlayer.playTick()
  })

  socket.on('start_game', () => {
    pageToggler.toggleStartGame()
    gameAnimation.addStartMotion()
    gameAnimation.addLoadMotion()
    gameSoundPlayer.playJingle()
  })

  //Waiting queue
  let waitingQueueManager = new WaitingQueueManager(pseudo, gameId, socket)
  waitingQueueManager.emitClientInfo()
  waitingQueueManager.listenConnectedPlayer()
  waitingQueueManager.listenWaitingQueueTimer()
  waitingQueueManager.roomError()

  let rankingManager = new RankingManager(pageToggler)

  socket.on('game_is_ready', () => {
    pageToggler.toggleQueue()
  })

  socket.on('break_transition', () => {
    pageToggler.toggleBreak()
    if(pseudo) {
      gameAnimation.addLoadMotion()
    } else {
      gameAnimation.addWaitMotion()
    }
    gameSoundPlayer.stopTick()
    gameSoundPlayer.increaseJingleVolume()
  })

  socket.on('game_is_over', (data) => {
    gameSoundPlayer.increaseJingleVolume()
    gameSoundPlayer.stopTick()
    let stats = data.stats
    pageToggler.toggleRanking();
    if(stats !== null) {
      let scores = scoreDisplayer.displayStatTable(stats)
      rankingManager.displayRanking(scoreDisplayer.getParticipants(stats[0].scores), scores)
      rankingManager.displayRankingTimer()
    }
  })
})
