function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      specialRound: 3,
      healRound: 4,
      winner: null,
      logMessages: []
    };
  },

  computed: {
    monsterBarLength() {
      if (this.monsterHealth < 0) {
        return { width: '0%' };
      }
      return { width: this.monsterHealth + '%' };
    },

    monsterBarColor() {
      if (this.monsterHealth < 20) {
        return 'healthbar__value--20';
      }
      if (this.monsterHealth < 60) {
        return 'healthbar__value--60';
      }
      return 'healthbar__value--100';
    },

    playerBarLength() {
      if (this.playerHealth < 0) {
        return { width: '0%' };
      }
      return { width: this.playerHealth + '%' };
    },

    playerBarColor() {
      if (this.playerHealth < 20) {
        return 'healthbar__value--20';
      }
      if (this.playerHealth < 60) {
        return 'healthbar__value--60';
      }
      return 'healthbar__value--100';
    },

    mayUseSpecialAttack() {
      return this.specialRound !== 3;
    },

    mayUseHeal() {
      console.log(this.healRound !== 4);
      return this.healRound !== 4;
    },
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // A draw
        this.winner = 'draw';
        this.playerHealth = 0;
      } else if (value <= 0) {
        // Player lost
        this.winner = 'monster';
        this.playerHealth = 0;
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // A draw
        this.winner = 'draw';
        this.monsterHealth = 0;
      } else if (value <= 0) {
        // Monster lost
        this.winner = 'player';
        this.monsterHealth = 0;
      }
    },
  },

  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.specialRound = 3;
      this.healRound = 4;
      this.logMessages = [];
    },

    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage('monster', 'attack', attackValue);

      this.specialRound !== 3 ? this.specialRound++ : '';
      this.healRound !== 4 ? this.healRound++ : '';
    },

    attackMonster() {
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage('player', 'attack', attackValue);
      this.attackPlayer();
    },

    specialAttackMonster() {
      this.specialRound = -1;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessage('player', 'attack', attackValue);
      this.attackPlayer();
    },

    healPlayer() {
      this.healRound = -1;
      const healValue = getRandomValue(8, 20);
      console.log(healValue);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage('player', 'heal', healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = 'monster';
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value
      });
    }
  },
});

app.mount('#game');

